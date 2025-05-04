import { app } from './app';

app.listen(process.env.PORT || 3000, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT || 3000}`)
);
