git pull origin
cd frontend
npm i
npm run build
cd ../backend
npm i
cd ../
pm2 restart mcss-frontend
pm2 restart mcss-backend