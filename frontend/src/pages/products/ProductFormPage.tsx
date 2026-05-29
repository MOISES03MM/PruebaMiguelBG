import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productService } from '../../services/product.service';
import { productSchema } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import type { ProductFormData } from '../../utils/validators';

export function ProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema) as any,
  });

  useEffect(() => {
    if (isEdit && id) {
      setFetching(true);
      productService.getById(id).then(product => {
        reset({
          name: product.name,
          description: product.description,
          category: product.category,
          sku: product.sku,
          stock: product.stock,
        });
      }).finally(() => setFetching(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ProductFormData) => {
    setLoading(true);
    try {
      const payload = { ...data, description: data.description || '' };
      if (isEdit && id) {
        await productService.update(id, payload);
        toast.success('Producto actualizado');
      } else {
        await productService.create(payload);
        toast.success('Producto creado');
      }
      navigate('/products');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar producto';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spinner />;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-lg shadow p-6 space-y-4">
        <Input id="name" label="Nombre" error={errors.name?.message} {...register('name')} />
        <Input id="description" label="Descripción" error={errors.description?.message} {...register('description')} />
        <Input id="category" label="Categoría" error={errors.category?.message} {...register('category')} />
        <Input id="sku" label="SKU" error={errors.sku?.message} {...register('sku')} />
        <Input id="stock" label="Stock" type="number" error={errors.stock?.message} {...register('stock')} />

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="secondary" type="button" onClick={() => navigate('/products')}>Cancelar</Button>
          <Button type="submit" isLoading={loading}>{isEdit ? 'Guardar' : 'Crear'}</Button>
        </div>
      </form>
    </div>
  );
}
