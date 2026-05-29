import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productService } from '../../services/product.service';
import { lotSchema } from '../../utils/validators';
import { Modal } from '../../components/common/Modal';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Spinner } from '../../components/common/Spinner';
import { formatCurrency, formatDate } from '../../utils/formatters';
import toast from 'react-hot-toast';
import type { Product, ProductLot } from '../../types/product.types';
import type { LotFormData } from '../../utils/validators';

interface Props {
  productId: string;
  onClose: () => void;
}

export function ProductLotsModal({ productId, onClose }: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [lots, setLots] = useState<ProductLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLot, setEditingLot] = useState<ProductLot | null>(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LotFormData>({
    resolver: zodResolver(lotSchema) as any,
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prod, lotsData] = await Promise.all([
        productService.getById(productId),
        productService.getLots(productId),
      ]);
      setProduct(prod);
      setLots(lotsData);
    } catch {
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const openCreate = () => {
    setEditingLot(null);
    reset({ lotNumber: '', price: 0, entryDate: new Date().toISOString().split('T')[0], quantity: 1, notes: '' });
    setShowForm(true);
  };

  const openEdit = (lot: ProductLot) => {
    setEditingLot(lot);
    reset({
      lotNumber: lot.lotNumber,
      price: lot.price,
      entryDate: lot.entryDate.split('T')[0],
      quantity: lot.quantity,
      notes: lot.notes || '',
    });
    setShowForm(true);
  };

  const onSubmit = async (data: LotFormData) => {
    if (!product) return;

    const maxAvailable = editingLot
      ? product.stock + editingLot.quantity
      : product.stock;

    if (data.quantity > maxAvailable) {
      toast.error(`Stock insuficiente. Disponible: ${maxAvailable}, solicitado: ${data.quantity}`);
      return;
    }

    try {
      const payload = { ...data, notes: data.notes || undefined };
      if (editingLot) {
        await productService.updateLot(productId, editingLot.id, payload);
        toast.success('Lote actualizado');
      } else {
        await productService.createLot(productId, payload);
        toast.success('Lote creado');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al guardar lote';
      toast.error(msg);
    }
  };

  const handleDelete = async (lotId: string) => {
    try {
      await productService.deleteLot(productId, lotId);
      toast.success('Lote eliminado');
      fetchData();
    } catch {
      toast.error('Error al eliminar lote');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Gestión de Lotes">
      {loading ? <Spinner /> : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{product?.name}</span>
              <span className="ml-3 px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                Stock disponible: {product?.stock}
              </span>
            </div>
            <Button onClick={openCreate} disabled={product?.stock === 0}>+ Agregar Lote</Button>
          </div>

          {showForm && (
            <form onSubmit={handleSubmit(onSubmit)} className="border rounded-lg p-4 space-y-3 bg-gray-50">
              <div className="text-xs text-gray-500 mb-2">
                Máximo asignable: {editingLot ? (product?.stock ?? 0) + editingLot.quantity : product?.stock ?? 0} unidades
              </div>
              <Input id="lotNumber" label="Número de Lote" error={errors.lotNumber?.message} {...register('lotNumber')} />
              <div className="grid grid-cols-2 gap-3">
                <Input id="price" label="Precio" type="number" step="0.01" error={errors.price?.message} {...register('price')} />
                <Input id="quantity" label="Cantidad" type="number" error={errors.quantity?.message} {...register('quantity')} />
              </div>
              <Input id="entryDate" label="Fecha de Ingreso" type="date" error={errors.entryDate?.message} {...register('entryDate')} />
              <Input id="notes" label="Notas" error={errors.notes?.message} {...register('notes')} />
              <div className="flex justify-end gap-2">
                <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancelar</Button>
                <Button type="submit">{editingLot ? 'Guardar' : 'Crear'}</Button>
              </div>
            </form>
          )}

          {lots.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No hay lotes registrados</p>
          ) : (
            <div className="space-y-2">
              {lots.map(lot => (
                <div key={lot.id} className="flex items-center justify-between border rounded-lg p-3 bg-white">
                  <div>
                    <span className="font-medium">{lot.lotNumber}</span>
                    <span className="text-gray-500 text-sm ml-3">{formatCurrency(lot.price)} × {lot.quantity}</span>
                    <span className="text-gray-400 text-xs ml-3">{formatDate(lot.entryDate)}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(lot)} className="text-blue-600 hover:text-blue-800 text-xs font-medium">Editar</button>
                    <button onClick={() => handleDelete(lot.id)} className="text-red-600 hover:text-red-800 text-xs font-medium">Eliminar</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
