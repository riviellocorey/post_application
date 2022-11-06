import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getPosts } from './features/posts/postSlice';
import Homepage from './components/pages/Homepage';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPosts());
  }, []);

  return (
    <Homepage></Homepage>
  );
}

export default App;
