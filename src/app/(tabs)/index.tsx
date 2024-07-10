
import ProductListItem, { Product } from '@/src/components/ProductListItem';
import { FlatList } from 'react-native';
import products from '../../../assets/data/products';


export default function TabOneScreen() {
  return (
    <FlatList
      data={products as Product[]}
      renderItem={({ item }) => <ProductListItem product={item} />}
    />
  );
}
