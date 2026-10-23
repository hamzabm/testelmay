export const URL_HELLOASSO = 'https://www.helloasso.com/associations/association-ouled-el-may';
export const URL_SITE = 'https://ouledelmay.fr/';
export const EMAIL = 'ouledelmay@gmail.com';

export const STATUTS = {
  'termine': { emoji: '✅', court: 'Terminé', filtre: 'Terminés' },
  'en-cours': { emoji: '🔄', court: 'En cours', filtre: 'En cours' },
  'a-venir': { emoji: '🌱', court: 'À venir', filtre: 'À venir' },
};

export function esc(text) {
  return String(text ?? '').replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[c]);
}
