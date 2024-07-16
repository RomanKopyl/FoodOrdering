import { useDeleteProduct, useInsertProduct, useProduct, useUpdateProduct } from '@/src/api/products';
import Button from '@/src/components/Button';
import { defaultPizzaImage } from '@/src/components/ProductListItem';
import Colors from '@/src/constants/Colors';
import { supabase } from '@/src/lib/supabase';
import { decode } from 'base64-arraybuffer';
import { randomUUID } from 'expo-crypto';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, StyleSheet, Text, TextInput, View } from 'react-native';

const CreateProductScreen = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [errors, setErrors] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const disabled = isLoading || isLoadingDelete;

  const { id: idString } = useLocalSearchParams();
  let id;
  id = parseFloat(typeof idString == 'string' ? idString : (idString?.[0] ?? ''));
  const { data: updatingProduct } = useProduct(id);

  const isUpdating = !!idString;

  const { mutate: insertProduct } = useInsertProduct();
  const { mutate: updateProduct } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const router = useRouter();

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct])


  const validateInput = () => {
    setErrors('');
    if (!name) {
      setErrors('Name is required');
      return false;
    }
    if (!price) {
      setErrors('Price is required');
      return false;
    }
    if (isNaN(parseFloat(price))) {
      setErrors('Price is not a number');
      return false;
    }
    return true;
  };

  const resetFields = () => {
    setName('');
    setPrice('');
  };

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSubmit = () => {
    if (isUpdating) {
      console.log('HERE');

      onUpdate();
    } else {
      onCreate();
    }
  };

  const onCreate = async () => {
    if (!validateInput()) {
      return;
    }

    const imagePath = await uploadImage();

    // Save in the database
    setIsLoading(true);
    insertProduct(
      { name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          router.back();
          setIsLoading(false);
        },
      }
    );
  };

  const onUpdate = async () => {
    if (!validateInput()) {
      return;
    }

    setIsLoading(true);
    const imagePath = await uploadImage();
    updateProduct(
      { id, name, price: parseFloat(price), image: imagePath },
      {
        onSuccess: () => {
          resetFields();
          setIsLoading(false);
          router.back();
        },
      }
    );
  };

  const onDelete = () => {
    setIsLoadingDelete(true);
    deleteProduct(id, {
      onSuccess: () => {
        resetFields();
        router.replace('/(admin)');
        setIsLoadingDelete(false);
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert('Confirm', 'Are you sure you want to delete this product', [
      {
        text: 'Cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: onDelete,
      },
    ]);
  };

  const uploadImage = async () => {
    if (!image?.startsWith('file://')) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: 'base64',
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = 'image/png';
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, decode(base64), { contentType });

    if (error) {
      Alert.alert('Don\'t upload');
      return;
    }

    if (data) {
      return data.path;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? 'Update Product' : 'Create Product' }}
      />

      <Image
        source={{ uri: image || defaultPizzaImage }}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        placeholder='Name'
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        placeholder='9.99'
        style={styles.input}
        keyboardType='numeric'
        value={price}
        onChangeText={setPrice}
      />

      <Text style={{ color: 'red' }}>{errors}</Text>
      <Button
        onPress={onSubmit}
        text={isUpdating ? "Update" : "Create"}
        isLoading={isLoading}
        disabled={disabled}
      />
      {
        isUpdating && (
          <Text
            disabled={disabled}
            onPress={confirmDelete}
            style={styles.textButton}
          >
            {isLoadingDelete ? 'Deleting...' : 'Delete'}
          </Text>
        )}
    </View>
  )
}

export default CreateProductScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 10,
  },
  image: {
    width: '50%',
    aspectRatio: 1,
    alignSelf: 'center',
  },
  textButton: {
    alignSelf: 'center',
    fontWeight: 'bold',
    color: Colors.light.tint,
    marginVertical: 10,
  },
  input: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 20,
  },
  label: {
    color: 'gray',
    fontSize: 16,
  },
});