import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Colors from "../constants/Colors";
import { Product } from "../types";
import { Link } from "expo-router";


interface Props {
  product: Product
};

const ProductListItem: React.FC<Props> = ({ product }) => {
  return (
    <Link href={`menu/${product.id}`} asChild>
      <Pressable style={styles.container}>
        {
          product.image &&
          <Image
            style={styles.image}
            source={{ uri: product.image }}
            resizeMode='contain'
          />
        }
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>{product.price}</Text>
      </Pressable>
    </Link >
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    flex: 1,
    maxWidth: '50%',
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