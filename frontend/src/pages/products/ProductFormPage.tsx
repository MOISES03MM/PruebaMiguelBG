import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productService } from '../../services/product.service';
import { productSchema } from '../../utils/validators';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { CATEGORIES } from '../../constants';
import type { Category } from '../../constants';
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
          category: product.category as Category,
          sku: product.sku,
          stock: product.stock,
        });
      }).finally(() => setFetching(false));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (data: ProductFormData) => {
    const name = data.name.trim();
    const category = data.category.trim();
    const sku = data.sku.trim();
    const description = (data.description || '').trim();

    if (!name || !category || !sku) return;

    setLoading(true);
    try {
      const payload = { name, description, category, sku, stock: data.stock };
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

  if (fetching) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <button onClick={() => navigate('/products')} className="text-sm text-gray-400 hover:text-gray-600 transition-colors mb-2">
          ← Volver a productos
        </button>
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
        <Input id="name" label="Nombre" placeholder="Nombre del producto" required error={errors.name?.message} {...register('name')} />
        <Input id="description" label="Descripción" placeholder="Descripción opcional" error={errors.description?.message} {...register('description')} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            id="category"
            label="Categoría"
            required
            placeholder="Selecciona una categoría"
            options={CATEGORIES}
            error={errors.category?.message}
            {...register('category')}
          />
          <Input id="sku" label="SKU" placeholder="Ej: PROD-001" required error={errors.sku?.message} {...register('sku')} />
        </div>
        <Input id="stock" label="Stock inicial" type="number" placeholder="0" required error={errors.stock?.message} {...register('stock')} />

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button variant="secondary" type="button" onClick={() => navigate('/products')}>Cancelar</Button>
          <Button type="submit" isLoading={loading}>{isEdit ? 'Guardar cambios' : 'Crear producto'}</Button>
        </div>
      </form>
    </div>
  );
}
