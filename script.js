'use strict';

// Both showcases share this renderer and this one expandable collection.
const seenEmailFiles = new Set();
const emailDesigns = (window.VIRIDIAN_EMAIL_DESIGNS || []).filter(email => {
  if (!email.file || !email.title || !email.brand || seenEmailFiles.has(email.file)) return false;
  seenEmailFiles.add(email.file);
  return true;
});
const emailRows = [[], []];
emailDesigns.forEach((email, index) => emailRows[index % 2].push(email));
function emailElement(tag, className) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  return element;
}
function createEmailCard(email) {
  const item = emailElement('li', 'email-marquee-item');
  const button = emailElement('button', 'email-marquee-card');
  button.type = 'button';
  button.dataset.email = email.file;
  button.dataset.title = `${email.brand} · ${email.title}`;
  button.setAttribute('aria-label', `View full email: ${email.brand}, ${email.title}`);
  const viewport = emailElement('span', 'email-preview-viewport');
  const image = emailElement('img');
  image.src = email.preview || email.file;
  image.alt = `${email.brand}: ${email.title} email design`;
  image.loading = 'eager';
  image.decoding = 'async';
  if (email.width && email.height) {
    image.width = email.previewWidth || email.width;
    image.height = email.previewHeight || email.height;
  }
  viewport.append(image);
  button.append(viewport);
  item.append(button);
  return item;
}
function cloneEmailGroup(group) {
  const duplicate = group.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  for (const button of duplicate.querySelectorAll('[data-email]')) button.tabIndex = -1;
  return duplicate;
}
const emailMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
const emailShowcases = [];
for (const section of document.querySelectorAll('[data-email-showcase]')) {
  const stage = section.querySelector('[data-email-rows]');
  const tracks = [];
  for (const [rowIndex, designs] of emailRows.entries()) {
    if (!designs.length) continue;
    const row = emailElement('div', 'email-marquee-row');
    row.dataset.direction = rowIndex === 0 ? 'left' : 'right';
    const moving = emailElement('div', 'email-marquee-track');
    const group = emailElement('ul', 'email-marquee-group');
    group.setAttribute('aria-label', `Email designs, row ${rowIndex + 1}`);
    for (const email of designs) group.append(createEmailCard(email));
    // An identical continuation produces the same frame at both loop endpoints.
    const duplicate = cloneEmailGroup(group);
    moving.append(group, duplicate);
    row.append(moving);
    stage.append(row);
    tracks.push({ moving, group, row });
  }
  let cards = Array.from(stage.querySelectorAll('[data-email]'));
  function measureEmailCard(card) {
    const viewport = card.querySelector('.email-preview-viewport');
    const image = card.querySelector('img');
    const frame = viewport.getBoundingClientRect();
    const sourceWidth = image.naturalWidth || Number(image.getAttribute('width')) || image.width;
    const sourceHeight = image.naturalHeight || Number(image.getAttribute('height')) || image.height;
    const displayedHeight = sourceWidth > 0 ? frame.width * sourceHeight / sourceWidth : image.getBoundingClientRect().height;
    const travel = Math.max(0, displayedHeight - frame.height);
    card.style.setProperty('--email-scroll-distance', `${-travel}px`);
    card.style.setProperty('--email-scroll-duration', `${Math.max(4, travel / 90)}s`);
  }
  function sizeEmailShowcase() {
    for (const { moving, group, row } of tracks) {
      const cycleWidth = group.getBoundingClientRect().width;
      if (!cycleWidth) continue;
      const copies = Math.max(2, Math.ceil(row.getBoundingClientRect().width / cycleWidth) + 1);
      while (moving.children.length < copies) moving.append(cloneEmailGroup(group));
      while (moving.children.length > copies) moving.lastElementChild.remove();
      moving.style.setProperty('--email-cycle-width', `${cycleWidth}px`);
      moving.style.setProperty('--email-row-duration', `${Math.max(25, cycleWidth / 30)}s`);
    }
    cards = Array.from(stage.querySelectorAll('[data-email]'));
    for (const card of cards) measureEmailCard(card);
  }
  // Delegation also covers continuation cards added after a screen resize.
  stage.addEventListener('pointerover', event => {
    const card = event.target.closest('[data-email]');
    if (card) measureEmailCard(card);
  });
  stage.addEventListener('load', event => {
    if (event.target.tagName !== 'IMG') return;
    const card = event.target.closest('[data-email]');
    if (card) measureEmailCard(card);
  }, true);
  if ('ResizeObserver' in window) {
    const observer = new ResizeObserver(sizeEmailShowcase);
    observer.observe(stage);
  } else window.addEventListener('resize', sizeEmailShowcase);
  sizeEmailShowcase();
  function updateEmailMotion() {
    const reduced = emailMotionPreference.matches;
    section.classList.toggle('emails-paused', reduced);
    section.classList.toggle('emails-reduced-motion', reduced);
  }
  emailMotionPreference.addEventListener('change', updateEmailMotion);
  // Keyboard browsing uses a stationary, scrollable row with one copy per email.
  stage.addEventListener('focusin', event => {
    const card = event.target.closest('[data-email]');
    if (card) measureEmailCard(card);
    if (card && card.matches(':focus-visible')) {
      if (!emailMotionPreference.matches) section.classList.add('emails-keyboard-browse');
      card.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    }
  });
  stage.addEventListener('focusout', event => {
    if (!stage.contains(event.relatedTarget)) {
      section.classList.remove('emails-keyboard-browse');
      for (const row of stage.querySelectorAll('.email-marquee-row')) row.scrollLeft = 0;
    }
  });
  updateEmailMotion();
  emailShowcases.push({ section, tracks, get cards() { return cards; }, size: sizeEmailShowcase });
}
// End shared email showcases.

const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
const setMenu = (open) => {
  menuToggle.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
};
menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenu(false);
    menuToggle.focus();
  }
});
const desktopQuery = window.matchMedia('(min-width: 1101px)');
desktopQuery.addEventListener('change', event => { if (event.matches) setMenu(false); });

const dialog = document.querySelector('#preview-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogContent = document.querySelector('#dialog-content');
const info = {
  linkedin: ['LinkedIn profile', 'The Viridian Point LinkedIn profile URL has not been added to this draft yet.'],
  instagram: ['Instagram profile', 'The Viridian Point Instagram profile URL has not been added to this draft yet.'],
  youtube: ['YouTube channel', 'The Viridian Point YouTube channel URL has not been added to this draft yet.'],
  video: ['Founder video', 'This is the founder video placeholder. We will replace it with your approved video and a real player before launch.'],
  booking: ['Your free strategy audit', 'This draft reserves a space for your 30-minute audit calendar. Once you choose your booking link, we will connect every audit button to that calendar. No booking or personal information is submitted here.'],
  privacy: ['Privacy policy placeholder', 'Your final privacy policy will explain what information the website collects, how it is used, and how visitors can contact you. Add the approved policy and contact details before launch.'],
  terms: ['Terms placeholder', 'Add your approved website terms and company details here before launch. This draft does not set service terms or create an agreement.']
};
function openDialog(title, content) {
  dialogTitle.textContent = title;
  dialogContent.replaceChildren(content);
  dialog.showModal();
  dialog.scrollTop = 0;
  document.body.classList.add('dialog-open');
}
document.querySelectorAll('[data-info]').forEach(button => button.addEventListener('click', () => {
  const [title, text] = info[button.dataset.info];
  const paragraph = document.createElement('p');
  paragraph.textContent = text;
  openDialog(title, paragraph);
}));
document.addEventListener('click', event => {
  const button = event.target.closest('[data-email]');
  if (!button) return;
  const image = document.createElement('img');
  image.src = button.dataset.email;
  image.alt = button.dataset.title + ': full email design';
  image.style.height = 'auto';
  openDialog(button.dataset.title, image);
});
document.querySelector('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => document.body.classList.remove('dialog-open'));
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
document.querySelector('#year').textContent = String(new Date().getFullYear());

// Two independent logo rows. Every brand belongs to only one row.
const logoStage = document.querySelector('#logo-marquees');
const svgNamespace = 'http://www.w3.org/2000/svg';
const seenLogoNames = new Set();
const seenLogoFiles = new Set();
const approvedLogos = (window.VIRIDIAN_CLIENT_LOGOS || []).filter(logo => {
  if (!logo.name || !logo.file) return false;
  const key = logo.name.trim().toLowerCase();
  if (seenLogoNames.has(key) || seenLogoFiles.has(logo.file)) return false;
  seenLogoNames.add(key);
  seenLogoFiles.add(logo.file);
  return true;
});
function createClientLogo(logo) {
  const item = document.createElement('li');
  const sizes = ['standard', 'wide', 'compact'];
  item.className = 'client-logo-slot client-logo-' + (sizes.includes(logo.size) ? logo.size : 'standard');
  item.classList.add(logo.originalBackground === 'dark' ? 'logo-original-dark' : 'logo-original-light');
  item.tabIndex = 0;
  item.title = `${logo.name} · Original colors on hover or focus`;
  const mark = document.createElementNS(svgNamespace, 'svg');
  mark.classList.add('client-logo-art');
  mark.setAttribute('role', 'img');
  mark.setAttribute('aria-label', logo.name);
  mark.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  mark.setAttribute('focusable', 'false');
  const artwork = document.createElementNS(svgNamespace, 'image');
  artwork.setAttribute('href', logo.file);
  artwork.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', logo.file);
  artwork.setAttribute('filter', logo.treatment === 'white-knockout' ? 'url(#client-logo-white-knockout)' : 'url(#client-logo-brand-color)');
  const setSize = (width, height) => {
    mark.setAttribute('viewBox', logo.viewBox || `0 0 ${width} ${height}`);
    artwork.setAttribute('width', String(width));
    artwork.setAttribute('height', String(height));
  };
  if (logo.width && logo.height) setSize(logo.width, logo.height);
  else {
    const probe = new Image();
    probe.onload = () => setSize(probe.naturalWidth, probe.naturalHeight);
    probe.src = logo.file;
  }
  mark.append(artwork);
  item.append(mark);
  return item;
}
const logoRows = [[], []];
approvedLogos.forEach((logo, index) => logoRows[index % 2].push(logo));
const logoMarqueeTracks = [];
for (const [index, logos] of logoRows.entries()) {
  if (!logos.length) continue;
  const viewport = document.createElement('div');
  viewport.className = 'logo-marquee-row';
  viewport.dataset.direction = index === 0 ? 'left' : 'right';
  const moving = document.createElement('div');
  moving.className = 'logo-marquee-track';
  const cycle = document.createElement('ul');
  cycle.className = 'client-logo-list logo-cycle';
  cycle.setAttribute('aria-label', `Client logos, row ${index + 1}`);
  for (const logo of logos) cycle.append(createClientLogo(logo));
  // A hidden second copy continues the same sequence across the wrap point.
  // It is not a second set of brands in the other row.
  const duplicate = cycle.cloneNode(true);
  duplicate.setAttribute('aria-hidden', 'true');
  duplicate.setAttribute('inert', '');
  moving.append(cycle, duplicate);
  viewport.append(moving);
  logoStage.append(viewport);
  logoMarqueeTracks.push({ moving, cycle });
}
function sizeLogoMarquees() {
  for (const { moving, cycle } of logoMarqueeTracks) {
    moving.style.setProperty('--logo-duration', `${Math.max(25, cycle.getBoundingClientRect().width / 32)}s`);
  }
}
if ('ResizeObserver' in window) {
  const logoSizeObserver = new ResizeObserver(sizeLogoMarquees);
  logoSizeObserver.observe(logoStage);
} else window.addEventListener('resize', sizeLogoMarquees);
sizeLogoMarquees();
const logoSection = document.querySelector('#partners');
const logoMotionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
function updateLogoMotion() {
  logoSection.classList.toggle('logos-paused', logoMotionPreference.matches);
}
logoMotionPreference.addEventListener('change', updateLogoMotion);
updateLogoMotion();

// Keyboard browsing keeps one stationary logo set without changing row heights.
logoStage.addEventListener('focusin', event => {
  const item = event.target.closest('.client-logo-slot');
  if (item && item.matches(':focus-visible')) {
    if (!logoMotionPreference.matches) logoSection.classList.add('logos-keyboard-browse');
    item.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  }
});
logoStage.addEventListener('focusout', event => {
  if (!logoStage.contains(event.relatedTarget)) {
    logoSection.classList.remove('logos-keyboard-browse');
    for (const row of logoStage.querySelectorAll('.logo-marquee-row')) row.scrollLeft = 0;
  }
});

// Keep anchor offsets aligned with the actual header, including font loading.
const siteHeader = document.querySelector('.site-header');
function updateHeaderOffset() {
  document.documentElement.style.setProperty('--header-height', `${Math.ceil(siteHeader.getBoundingClientRect().height)}px`);
}
if ('ResizeObserver' in window) {
  const headerObserver = new ResizeObserver(updateHeaderOffset);
  headerObserver.observe(siteHeader);
} else window.addEventListener('resize', updateHeaderOffset);
updateHeaderOffset();

// Pause offscreen marquees at their current position to reduce scroll work.
if ('IntersectionObserver' in window) {
  const motionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) entry.target.classList.toggle('motion-offscreen', !entry.isIntersecting);
  }, { rootMargin: '160px 0px' });
  for (const section of document.querySelectorAll('#partners, [data-email-showcase]')) motionObserver.observe(section);
}

// The footer icons become outbound links once real agency URLs are supplied.
for (const button of document.querySelectorAll('[data-social]')) {
  const value = (window.VIRIDIAN_SOCIAL_LINKS || {})[button.dataset.social];
  if (!value) continue;
  let destination;
  try { destination = new URL(value); } catch { continue; }
  if (destination.protocol !== 'https:' && destination.protocol !== 'http:') continue;
  const link = document.createElement('a');
  link.className = button.className;
  link.href = destination.href;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.setAttribute('aria-label', button.getAttribute('aria-label'));
  link.title = button.title;
  for (const child of Array.from(button.childNodes)) link.append(child);
  button.replaceWith(link);
}
