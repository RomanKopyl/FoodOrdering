import { Image, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";

export type Product = {
  id: number;
  name: string;
  image: string;
  price: number;
};

interface Props {
  product: Product
};

const ProductListItem: React.FC<Props> = ({ product }) => {
  console.log(product);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: product.image }} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>{product.price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginVertical: 10,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: 'bold',
  },
});

export default ProductListItem;