const REQUIRED_ENV_VARS = [
  'EXPO_PUBLIC_APPWRITE_ENDPOINT',
  'EXPO_PUBLIC_APPWRITE_PROJECT_ID',
  'EXPO_PUBLIC_APPWRITE_DATABASE_ID',
  'EXPO_PUBLIC_APPWRITE_USERS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_PLANTS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_IMAGES_STORAGE_BUCKET_ID',
  'EXPO_PUBLIC_PROJECT_ID',
] as const;

const OPTIONAL_ENV_VARS = [
  'EXPO_PUBLIC_WEATHER_API_SERVICE_FUNCTION_ID',
  'EXPO_PUBLIC_PLANTNETAPI_FUNCTION_ID',
  'EXPO_PUBLIC_CHUTES_FUNCTION_ID',
  'EXPO_PUBLIC_AUTH_FUNCTION_ID',
  'EXPO_PUBLIC_APPWRITE_BUGS_COLLECTION_ID',
  'EXPO_PUBLIC_APPWRITE_USER_MESSAGES_COLLECTION_ID',
] as const;

export function validateEnv(): { ok: true } | { ok: false; missing: string[] } {
  const missing = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    return { ok: false, missing: [...missing] };
  }

  if (__DEV__) {
    const unsetOptional = OPTIONAL_ENV_VARS.filter((key) => !process.env[key]);
    if (unsetOptional.length > 0) {
      console.warn(
        'Optional env vars not set (some features may be unavailable):',
        unsetOptional.join(', ')
      );
    }
  }

  return { ok: true };
}
