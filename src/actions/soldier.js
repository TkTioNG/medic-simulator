export const MOVE_SOLDIER = 'MOVE_SOLDIER';

export const moveSoldier = (id, coordDelta) => ({
  type: MOVE_SOLDIER,
  id,
  coordDelta,
});
