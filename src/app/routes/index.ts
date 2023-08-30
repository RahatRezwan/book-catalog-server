import express from 'express';
const router = express.Router();
const homeRoutes = router.get('/', (req, res) => res.send('Welcome to the Cow Hut'));

const moduleRoutes = [
   {
      path: '/',
      route: homeRoutes,
   },
];

moduleRoutes.forEach((route) => {
   router.use(route.path, route.route);
});

export default router;
