1. Create the migratio with supabase server to local

# 

2. Create the migration with local to supabase server:

# npx supabase db diff -f

# add_stripe_field npx supabase db push

3. Run the function locally:

# npx supabase functions serve --env-file .env payment-sheet
