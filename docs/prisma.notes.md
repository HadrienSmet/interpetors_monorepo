# Updates the db from model
npx prisma db push

# Updates the db from model and erase all the data that was there
npx prisma db push --force-reset

# Check the update
npx prisma studio

# Creates the PrismaCLI based on schema
npx prisma generate
