import React, { useEffect, useMemo, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from 'firebase/auth';
import { auth, db, firebaseEnabled } from './lib/firebase';

type ModerationStatus = 'pending' | 'approved' | 'rejected';

type ModerationItem = {
  id: string;
  name: string;
  idea?: string;
  impact?: string;
  drawbacks?: string;
  status: ModerationStatus;
  createdAt: number;
};

type CommentItem = {
  id: string;
  name: string;
  text: string;
  status: ModerationStatus;
  createdAt: number;
};

const statusColor = (status: ModerationStatus) => {
  if (status === 'approved') return 'text-emerald-300';
  if (status === 'rejected') return 'text-amber-300';
  return 'text-[#d57a4b]';
};

export const AdminModeration: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [solutions, setSolutions] = useState<ModerationItem[]>([]);
  const [commentsBySolution, setCommentsBySolution] = useState<Record<string, CommentItem[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Watch the signed-in user and check for the admin badge.
  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setIsAdmin(false);
        return;
      }
      const token = await nextUser.getIdTokenResult(true);
      setIsAdmin(token.claims.admin === true);
    });
  }, []);

  // Live list of solutions. Updates by itself, no refresh needed.
  useEffect(() => {
    if (!db || !isAdmin) {
      setSolutions([]);
      return;
    }
    const database = db;
    setLoading(true);
    setLoadError(null);

    const unsubscribe = onSnapshot(
      query(collection(database, 'solutions'), orderBy('createdAt', 'desc')),
      (snapshot) => {
        setSolutions(
          snapshot.docs.map((item) => {
            const data = item.data() as {
              name?: string;
              idea?: string;
              impact?: string;
              drawbacks?: string;
              status?: ModerationStatus;
              createdAt?: { toMillis?: () => number };
            };
            return {
              id: item.id,
              name: data.name ?? 'Anonymous Explorer',
              idea: data.idea,
              impact: data.impact,
              drawbacks: data.drawbacks,
              status: data.status ?? 'pending',
              createdAt: data.createdAt?.toMillis?.() ?? 0,
            };
          }),
        );
        setLoading(false);
      },
      (error) => {
        console.error('ADMIN: solutions listener failed', error);
        setLoadError((error as { code?: string }).code ?? 'Could not load submissions.');
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [isAdmin]);

  // Only resubscribe to comments when the list of solution ids changes.
  const solutionIds = useMemo(() => solutions.map((s) => s.id).join(','), [solutions]);

  // Live comments for every solution.
  useEffect(() => {
    if (!db || !isAdmin || !solutionIds) {
      setCommentsBySolution({});
      return;
    }
    const database = db;

    const unsubscribers = solutionIds.split(',').map((solutionId) =>
      onSnapshot(
        collection(database, 'solutions', solutionId, 'comments'),
        (snapshot) => {
          const items: CommentItem[] = snapshot.docs
            .map((item) => {
              const data = item.data() as {
                name?: string;
                text?: string;
                status?: ModerationStatus;
                createdAt?: { toMillis?: () => number };
              };
              return {
                id: item.id,
                name: data.name ?? 'Anonymous Explorer',
                text: data.text ?? '',
                status: data.status ?? 'pending',
                createdAt: data.createdAt?.toMillis?.() ?? 0,
              };
            })
            .sort((a, b) => a.createdAt - b.createdAt);

          setCommentsBySolution((current) => ({ ...current, [solutionId]: items }));
        },
        (error) => console.error('ADMIN: comments listener failed', solutionId, error),
      ),
    );

    return () => unsubscribers.forEach((unsubscribe) => unsubscribe());
  }, [solutionIds, isAdmin]);

  const login = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth) return;
    setLoginError(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setPassword('');
    } catch (err) {
      console.error(err);
      setLoginError(`Sign-in failed: ${(err as { code?: string }).code ?? 'unknown'}`);
    }
  };

  const run = async (action: () => Promise<void>) => {
    setActionError(null);
    try {
      await action();
    } catch (err) {
      console.error('ADMIN: action failed', err);
      setActionError((err as { code?: string }).code ?? 'Action failed.');
    }
  };

  const moderateSolution = (id: string, status: ModerationStatus) =>
    run(() => updateDoc(doc(db!, 'solutions', id), { status, moderatedAt: new Date() }));

  const removeSolution = (id: string) => run(() => deleteDoc(doc(db!, 'solutions', id)));

  const moderateComment = (solutionId: string, commentId: string, status: ModerationStatus) =>
    run(() =>
      updateDoc(doc(db!, 'solutions', solutionId, 'comments', commentId), {
        status,
        moderatedAt: new Date(),
      }),
    );

  const removeComment = (solutionId: string, commentId: string) =>
    run(() => deleteDoc(doc(db!, 'solutions', solutionId, 'comments', commentId)));

  const pendingSolutions = solutions.filter((s) => s.status === 'pending').length;
  const pendingComments = Object.values(commentsBySolution)
    .flat()
    .filter((c) => c.status === 'pending').length;

  if (!firebaseEnabled) {
    return <p className="p-8 text-sm text-[#aaa3a1]">Firebase is not configured.</p>;
  }

  if (!user || !isAdmin) {
    return (
      <main className="min-h-screen bg-[#08090c] p-6 text-[#eee9e1]">
        <form onSubmit={login} className="mx-auto mt-20 max-w-md rounded-3xl border border-white/10 bg-[#111319] p-7">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d57a4b]">PRIVATE / ADMIN</p>
          <h1 className="mt-3 font-serif text-3xl">MENDER moderation</h1>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Admin email"
            className="mt-6 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
          />
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Password"
            className="mt-3 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm outline-none"
          />
          <button className="mt-4 w-full rounded-full bg-[#eee9e1] px-5 py-3 text-sm font-medium text-[#101115]">
            Sign in
          </button>
          {loginError ? <p className="mt-3 text-xs text-red-300">{loginError}</p> : null}
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#08090c] p-6 text-[#eee9e1]">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#d57a4b]">PRIVATE / ADMIN</p>
            <h1 className="mt-2 font-serif text-4xl">MENDER moderation</h1>
            <p className="mt-2 text-xs text-[#9a948f]">
              Pending: {pendingSolutions} solution{pendingSolutions === 1 ? '' : 's'}, {pendingComments} comment
              {pendingComments === 1 ? '' : 's'}
            </p>
          </div>
          <button onClick={() => void signOut(auth!)} className="rounded-full border border-white/10 px-4 py-2 text-xs">
            Sign out
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {loading ? <p className="text-sm text-[#777272]">Loading…</p> : null}
          {loadError ? <p className="text-sm text-red-300">Error loading: {loadError}</p> : null}
          {actionError ? <p className="text-sm text-red-300">Error: {actionError}</p> : null}
          {!loading && !loadError && solutions.length === 0 ? (
            <p className="text-sm text-[#777272]">No submissions yet.</p>
          ) : null}

          {solutions.map((item) => {
            const comments = commentsBySolution[item.id] ?? [];
            return (
              <article key={item.id} className="rounded-2xl border border-white/10 bg-[#111319] p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className={`font-mono text-[9px] uppercase tracking-widest ${statusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-[#777272]">{item.name}</span>
                </div>
                <p className="mt-3 text-sm leading-6">{item.idea}</p>
                {item.impact ? (
                  <p className="mt-2 text-xs leading-5 text-[#b8b2ad]">
                    <span className="text-[#777272]">Impact: </span>
                    {item.impact}
                  </p>
                ) : null}
                {item.drawbacks ? (
                  <p className="mt-1 text-xs leading-5 text-[#b8b2ad]">
                    <span className="text-[#777272]">Drawbacks: </span>
                    {item.drawbacks}
                  </p>
                ) : null}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button onClick={() => void moderateSolution(item.id, 'approved')} className="rounded-full border border-emerald-300/20 px-3 py-1.5 text-xs text-emerald-200">Approve</button>
                  <button onClick={() => void moderateSolution(item.id, 'rejected')} className="rounded-full border border-amber-300/20 px-3 py-1.5 text-xs text-amber-200">Reject</button>
                  <button onClick={() => void removeSolution(item.id)} className="rounded-full border border-red-300/20 px-3 py-1.5 text-xs text-red-200">Remove</button>
                </div>

                {comments.length > 0 ? (
                  <div className="mt-5 space-y-3 border-t border-white/10 pt-4">
                    <p className="font-mono text-[9px] uppercase tracking-widest text-[#777272]">
                      Comments ({comments.length})
                    </p>
                    {comments.map((comment) => (
                      <div key={comment.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className={`font-mono text-[9px] uppercase tracking-widest ${statusColor(comment.status)}`}>
                            {comment.status}
                          </span>
                          <span className="text-[11px] text-[#777272]">{comment.name}</span>
                        </div>
                        <p className="mt-2 text-sm leading-6">{comment.text}</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button onClick={() => void moderateComment(item.id, comment.id, 'approved')} className="rounded-full border border-emerald-300/20 px-3 py-1 text-[11px] text-emerald-200">Approve</button>
                          <button onClick={() => void moderateComment(item.id, comment.id, 'rejected')} className="rounded-full border border-amber-300/20 px-3 py-1 text-[11px] text-amber-200">Reject</button>
                          <button onClick={() => void removeComment(item.id, comment.id)} className="rounded-full border border-red-300/20 px-3 py-1 text-[11px] text-red-200">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default AdminModeration;