import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
    const navigate = useNavigate();

  useEffect(() => {
    const token1 = localStorage.getItem("token");
    if (token1 == null) {
      // chuyển sang trang Home
      navigate("/");
    }
  }, [navigate]);
      return (
  <div>
      <h1 className="text-3xl font-bold underline">
    Hello world!
  </h1>
 
    </div>
  )
}
