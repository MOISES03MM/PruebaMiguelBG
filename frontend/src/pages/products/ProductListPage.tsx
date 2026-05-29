import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { usePagination } from '../../hooks/usePagination';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { Modal } from '../../components/common/Modal';
import { ProductLotsModal } from './ProductLotsModal';
import { formatDate } from '../../utils/formatters';

export function ProductListPage() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  const { page, pageSize, nextPage, prevPage, reset } = usePagination();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [lotsProductId, setLotsProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts({ page, pageSize, name: search || undefined, category: categoryFilter || undefined });
  }, [page, pageSize, fetchProducts]);

  const handleSearch = () => {
    reset();
    fetchProducts({ page: 1, pageSize, name: search || undefined, category: categoryFilter || undefined });
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const success = await deleteProduct(deleteId);
    if (success) {
      setDeleteId(null);
      fetchProducts({ page, pageSize, name: search || undefined, category: categoryFilter || undefined });
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Productos</h1>
        <Button onClick={() => navigate('/products/new')}>+ Nuevo Producto</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <Input
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Input
          placeholder="Filtrar por categoría..."
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button variant="secondary" onClick={handleSearch}>Buscar</Button>
      </div>

      {loading ? (
        <Spinner />
      ) : products.data.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No se encontraron productos</p>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Nombre</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">SKU</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Categoría</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Creado</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {products.data.map(product => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.sku}</td>
                    <td className="px-4 py-3 text-gray-600">{product.category}</td>
                    <td className="px-4 py-3">{product.stock}</td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(product.createdAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setLotsProductId(product.id)}
                          className="text-green-600 hover:text-green-800 text-xs font-medium"
                        >
                          Lotes
                        </button>
                        <button
                          onClick={() => navigate(`/products/${product.id}/edit`)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteId(product.id)}
                          className="text-red-600 hover:text-red-800 text-xs font-medium"
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-center mt-4">
            <span className="text-sm text-gray-500">
              Página {products.page} de {products.totalPages} ({products.totalCount} productos)
            </span>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={prevPage} disabled={page <= 1}>Anterior</Button>
              <Button variant="secondary" onClick={() => nextPage(products.totalPages)} disabled={page >= products.totalPages}>Siguiente</Button>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar eliminación">
        <p className="text-gray-600 mb-4">¿Estás seguro de que deseas eliminar este producto?</p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button variant="danger" onClick={handleDelete}>Eliminar</Button>
        </div>
      </Modal>

      {lotsProductId && (
        <ProductLotsModal
          productId={lotsProductId}
          onClose={() => {
            setLotsProductId(null);
            fetchProducts({ page, pageSize, name: search || undefined, category: categoryFilter || undefined });
          }}
        />
      )}
    </div>
  );
}
