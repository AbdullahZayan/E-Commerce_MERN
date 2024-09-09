import { Box, Container, Grid,} from "@mui/material";
import ProductCard from "../components/ProductCard";
import { useEffect, useState } from "react";
import { Product } from "../types/Product";
import { BASE_URL } from "../constants/baseURL";


const HomePage = () => {
  const [product, setProduct] = useState<Product[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        try{
            const response = await fetch(`${BASE_URL}/product`);
            const data = await response.json();
            setProduct(data);
        } catch {
            setError (true);
        }
        
    };
    fetchData();
  }, []);

  if(error) {
    return <Box>Something Went wrong</Box>
  }
  
  return (
    <Container sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        {product.map((p) => (
          <Grid item md={4}>
            <ProductCard {...p} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};
export default HomePage;
