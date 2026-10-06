import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';
import { initializeApp } from 'firebase-admin/app';

initializeApp();
const db = getFirestore();

// Keep this list deliberately small and maintain it on the server.
// This is a first-pass filter, not a replacement for human moderation.
const BLOCKED_PATTERNS = [
  /\bf+u+c+k+/i,
  /\bs+h+i+t+/i,
  /\ba+s+s+h+o+l+e+/i,
  /\bb+i+t+c+h+/i,
  /\bsp+a+m+m+e+r\b/i,
];

const MAX_LENGTHS = {
  idea: 280,
  impact: 200,
  drawbacks: 200,
  comment: 240,
  name: 40,
};

function containsBlockedText(values: string[]) {
  return values.some((value) => BLOCKED_PATTERNS.some((pattern) => pattern.test(value)));
}

function tooLong(values: Array<[string, number]>) {
  return values.some(([value, max]) => value.length > max);
}

function clean(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export const moderateSolution = onDocumentCreated('solutions/{solutionId}', async (event) => {
  const snap = event.data;
  if (!snap) return;

  const data = snap.data();
  if (data.status !== 'pending') return;

  const idea = clean(data.idea);
  const impact = clean(data.impact);
  const drawbacks = clean(data.drawbacks);
  const name = clean(data.name);

  const invalid =
    !idea ||
    tooLong([
      [idea, MAX_LENGTHS.idea],
      [impact, MAX_LENGTHS.impact],
      [drawbacks, MAX_LENGTHS.drawbacks],
      [name, MAX_LENGTHS.name],
    ]) ||
    containsBlockedText([idea, impact, drawbacks, name]);

  await snap.ref.update({
    status: invalid ? 'rejected' : 'approved',
    moderatedAt: FieldValue.serverTimestamp(),
    moderationReason: invalid ? 'automatic-filter' : 'automatic-approval',
  });
});

export const moderateComment = onDocumentCreated(
  'solutions/{solutionId}/comments/{commentId}',
  async (event) => {
    const snap = event.data;
    if (!snap) return;

    const data = snap.data();
    if (data.status !== 'pending') return;

    const text = clean(data.text);
    const name = clean(data.name);
    const invalid =
      !text ||
      tooLong([
        [text, MAX_LENGTHS.comment],
        [name, MAX_LENGTHS.name],
      ]) ||
      containsBlockedText([text, name]);

    await snap.ref.update({
      status: invalid ? 'rejected' : 'approved',
      moderatedAt: FieldValue.serverTimestamp(),
      moderationReason: invalid ? 'automatic-filter' : 'automatic-approval',
    });
  },
);

// Admin helper. Run once from a trusted environment with the target user's UID.
// Example: setAdminClaim('UID_HERE') from the Firebase Admin SDK shell/script.
export async function setAdminClaim(uid: string) {
  const { getAuth } = await import('firebase-admin/auth');
  await getAuth().setCustomUserClaims(uid, { admin: true });
}
