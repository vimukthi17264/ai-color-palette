

// supabaseActions.ts

import { createClient } from "@/utils/supabase/client";

// Initialize Supabase client
const supabase = createClient();

// ===================== Tokens Table Actions =====================

/**
 * Fetches a user's token balance and token details.
 * @param userId - The UUID of the user.
 * @returns Token information including balance, purchased tokens, and used tokens.
 */
export const getUserTokens = async (userId: string) => {
  const { data, error } = await supabase
    .from('tokens')
    .select('balance, purchased_tokens, used_tokens')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error fetching tokens:", error);
    throw error;
  }

  return data;
};

/**
 * Adds purchased tokens to a user's balance.
 * @param userId - The UUID of the user.
 * @param amount - The number of tokens to add to the purchased_tokens field.
 * @returns The updated token record.
 */
export const addPurchasedTokens = async (userId: string, amount: number) => {
  const { data, error } = await supabase
    .rpc('add_purchased_tokens', { user_id: userId, amount });

  if (error) {
    console.error("Error adding purchased tokens:", error);
    throw error;
  }

  return data;
};

/**
 * Deducts tokens from a user's balance after usage.
 * @param userId - The UUID of the user.
 * @param amount - The number of tokens to deduct from the used_tokens field.
 * @returns The updated token record.
 */
export const deductUsedTokens = async (userId: string, amount: number) => {
  const { data, error } = await supabase
    .rpc('deduct_used_tokens', { user_id: userId, amount });

  if (error) {
    console.error("Error deducting used tokens:", error);
    throw error;
  }

  return data;
};

/**
 * Updates the token balance directly.
 * @param userId - The UUID of the user.
 * @param newBalance - The new balance to set for the user.
 * @returns The updated token record.
 */
export const updateTokenBalance = async (userId: string, newBalance: number) => {
  const { data, error } = await supabase
    .from('tokens')
    .update({ balance: newBalance })
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error updating token balance:", error);
    throw error;
  }

  return data;
};

// ===================== Profiles Table Actions =====================

/**
 * Fetches a user's profile details.
 * @param userId - The UUID of the user.
 * @returns Profile information including username, avatar_url, and description.
 */
export const getUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('username, avatar_url, bio')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }

  return data;
};

/**
 * Creates or updates a user's profile.
 * @param userId - The UUID of the user.
 * @param profileData - An object containing the fields to update (username, avatar_url, description).
 * @returns The upserted profile record.
 */
export const upsertUserProfile = async (userId: string, profileData: { username: string; avatar_url: string; description: string }) => {
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      user_id: userId,
      ...profileData,
    });

  if (error) {
    console.error("Error upserting profile:", error);
    throw error;
  }

  return data;
};

/**
 * Updates a user's profile username and description.
 * @param userId - The UUID of the user.
 * @param username - The new username.
 * @param description - The new description for the profile.
 * @returns The updated profile record.
 */
export const updateUserProfile = async (userId: string, username: string, description: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ username, description })
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error("Error updating profile:", error);
    throw error;
  }

  return data;
};

/**
 * Deletes a user's profile.
 * @param userId - The UUID of the user.
 * @returns The result of the delete operation.
 */
export const deleteUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .delete()
    .eq('user_id', userId);

  if (error) {
    console.error("Error deleting profile:", error);
    throw error;
  }

  return data;
};
/**
 * Get a List of transactions made by user, ordered from latest to oldest
 * @param userId - the UUID of the user
 * @returns list of transactions
 */
export const fetchUserTransactions = async (userId: string) => {
  let { data: payments, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }); // Sort by 'created_at' in descending order

  if (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }

  return payments;
};