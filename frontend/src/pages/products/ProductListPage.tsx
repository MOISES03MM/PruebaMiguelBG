import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { usePagination } from '../../hooks/usePagination';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Spinner } from '../../components/common/Spinner';
import { Modal } from '../../components/common/Modal';
import { Pagination } from '../../components/common/Pagination';
import { ProductLotsModal } from './ProductLotsModal';
import { formatDate } from '../../utils/formatters';
import type { Product } from '../../types/product.types';

export function ProductListPage() {
  const navigate = useNavigate();
  const { products, loading, fetchProducts, deleteProduct } = useProducts();
  const { page, pageSize, nextPage, prevPage, changePageSize, reset } = usePagination();

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
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No se encontraron productos</p>
          <p className="text-gray-300 text-sm mt-1">Crea uno nuevo para empezar</p>
        </div>
      ) : (
        <>
          {/* Desktop: Table */}
          <div className="hidden lg:block overflow-x-auto bg-white rounded-xl shadow-sm border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50/80">
                <tr>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 uppercase text-xs tracking-wider">Nombre</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 uppercase text-xs tracking-wider">SKU</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 uppercase text-xs tracking-wider">Categoría</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 uppercase text-xs tracking-wider">Stock</th>
                  <th className="text-left px-5 py-3.5 font-medium text-gray-500 uppercase text-xs tracking-wider">Creado</th>
                  <th className="text-right px-5 py-3.5 font-medium text-gray-500 uppercase text-xs tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.data.map(product => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4 font-medium text-gray-800">{product.name}</td>
                    <td className="px-5 py-4 text-gray-500 font-mono text-xs">{product.sku}</td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{product.category}</span>
                    </td>
                    <td className="px-5 py-4">
                      <StockBadge stock={product.stock} />
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs">{formatDate(product.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-1">
                        <ActionButton label="Lotes" color="green" onClick={() => setLotsProductId(product.id)} />
                        <ActionButton label="Editar" color="blue" onClick={() => navigate(`/products/${product.id}/edit`)} />
                        <ActionButton label="Eliminar" color="red" onClick={() => setDeleteId(product.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet: Cards */}
          <div className="lg:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {products.data.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onLots={() => setLotsProductId(product.id)}
                onEdit={() => navigate(`/products/${product.id}/edit`)}
                onDelete={() => setDeleteId(product.id)}
              />
            ))}
          </div>

          <Pagination
            page={products.page}
            totalPages={products.totalPages}
            totalCount={products.totalCount}
            pageSize={pageSize}
            onPrev={prevPage}
            onNext={() => nextPage(products.totalPages)}
            onChangePageSize={changePageSize}
          />
        </>
      )}

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Confirmar eliminación">
        <p className="text-gray-600 mb-6">¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.</p>
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

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-xs font-medium">Sin stock</span>;
  if (stock <= 5) return <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">{stock} uds</span>;
  return <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">{stock} uds</span>;
}

function ActionButton({ label, color, onClick }: { label: string; color: string; onClick: () => void }) {
  const colors: Record<string, string> = {
    green: 'text-green-600 hover:bg-green-50',
    blue: 'text-blue-600 hover:bg-blue-50',
    red: 'text-red-600 hover:bg-red-50',
  };
  return (
    <button onClick={onClick} className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${colors[color]}`}>
      {label}
    </button>
  );
}

function ProductCard({ product, onLots, onEdit, onDelete }: { product: Product; onLots: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-gray-800">{product.name}</h3>
          <p className="text-xs text-gray-400 font-mono mt-0.5">{product.sku}</p>
        </div>
        <StockBadge stock={product.stock} />
      </div>
      <div className="flex items-center gap-2">
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">{product.category}</span>
        <span className="text-xs text-gray-400">{formatDate(product.createdAt)}</span>
      </div>
      <div className="flex justify-end gap-1 pt-2 border-t border-gray-50">
        <ActionButton label="Lotes" color="green" onClick={onLots} />
        <ActionButton label="Editar" color="blue" onClick={onEdit} />
        <ActionButton label="Eliminar" color="red" onClick={onDelete} />
      </div>
    </div>
  );
}
