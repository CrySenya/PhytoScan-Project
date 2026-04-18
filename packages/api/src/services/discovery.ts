import { supabase } from '../lib/supabase';
import { awardXP } from './xp';

export const approveDiscovery = async (submissionId: string): Promise<void> => {
  // 1. Fetch the submission
  const { data: sub } = await supabase
    .from('plant_submissions')
    .select('*')
    .eq('id', submissionId)
    .single();
  if (!sub) throw new Error('Submission not found');

  // 2. Add to the main plant_species table
  await supabase.from('plant_species').insert({
    common_name:      sub.plant_name,
    scientific_name:  `Species nov. ${sub.plant_name}`,  // Placeholder until named
    description:      sub.description,
    fantasy_lore:     sub.ai_analysis,
    images:           sub.images,
    discovered_by:    sub.user_id,
    is_new_discovery: true,
    xp_reward:        50,
  });

  // 3. Update submission status
  await supabase.from('plant_submissions')
    .update({ status: 'approved' })
    .eq('id', submissionId);

  // 4. Award 500 XP bonus + increment discoveries count
  await awardXP(sub.user_id, 500);
  await supabase.rpc('increment_discoveries', { uid: sub.user_id });
};
