// Save session after login
export async function saveSession(session) {
  await EncryptedStorage.setItem( "supabase_session", JSON.stringify(session) );
}

// Restore session on app startup
export async function getSession() {
  const data = await EncryptedStorage.getItem("supabase_session");
  return data ? JSON.parse(data) : null;
}

// Clear session on logout
export async function clearSession() {
  await EncryptedStorage.removeItem("supabase_session");
}
