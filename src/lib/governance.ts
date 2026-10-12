export type CouncilVote = { member: string; choice: 'yes' | 'no' | 'abstain' };
export function councilOutcome(votes: CouncilVote[], chairTieBreak?: 'yes' | 'no') {
  const yes = votes.filter(v => v.choice === 'yes').length;
  const no = votes.filter(v => v.choice === 'no').length;
  if (yes === no && yes > 0) return chairTieBreak ? (chairTieBreak === 'yes' ? 'approved' : 'rejected') : 'tie';
  return yes > no ? 'approved' : 'rejected';
}
export function canVeto(status: string, role: string) { return status === 'approved' && role === 'representative'; }
export function validPetitionSupport(existing: string[], userId: string) { return userId.length > 0 && !existing.includes(userId); }
