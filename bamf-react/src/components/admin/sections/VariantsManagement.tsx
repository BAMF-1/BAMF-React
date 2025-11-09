// ============================================
// File: components/admin/sections/VariantsManagement.tsx
// ============================================
"use client";
import { useEffect, useState } from 'react';
import { BaseCRUDComponent, Column } from '../BaseCRUDComponent';
import { FormWrapper, FormField } from '../FormWrapper';
import { variantService, groupService, Variant, Group } from '@/lib/services/adminServices';
import { Package } from 'lucide-react';
import { toast } from 'react-toastify';

export default function VariantsManagement() {
    const [variants, setVariants] = useState<Variant[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState<number | string | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [page, setPage] = useState(1);
    const [formData, setFormData] = useState<Partial<Variant>>({});
    const [showInventoryModal, setShowInventoryModal] = useState(false);
    const [inventoryAdjustment, setInventoryAdjustment] = useState<{ variantId: string; amount: number; transactionType: number } | null>(null);

    useEffect(() => {
        loadGroups();
    }, []);

    useEffect(() => {
        if (selectedGroupId) {
            loadVariants(selectedGroupId);
        }
    }, [selectedGroupId]);

    const loadGroups = async () => {
        try {
            const response = await groupService.getAll();
            const groupsData = response.data || [];
            setGroups(groupsData);

            if (groupsData.length > 0 && !selectedGroupId) {
                setSelectedGroupId(groupsData[0].id);
            }
        } catch (error) {
            console.error('Error loading groups:', error);
        }
    };

    const loadVariants = async (groupId: number | string, reset = true, pageNum = 1) => {
        if (reset) {
            setIsLoading(true);
            setPage(1);
        }
        try {
            const [response, response2] = await Promise.all([
                variantService.getByGroup(groupId, pageNum),
                variantService.getByGroupCount(groupId)
            ]);

            if (reset) {
                setVariants(response.data || []);
            } else {
                setVariants(prev => [...prev, ...(response.data || [])]);
            }
            setTotalCount(typeof response2.data === 'object' && response2.data !== null && 'count' in response2.data
                ? (response2.data as any).count
                : response2.data || 0);
        } catch (error) {
            console.error('Error loading variants:', error);
            toast.error('Failed to load variants');
            setVariants([]);
        } finally {
            if (reset) {
                setIsLoading(false);
            } else {
                setIsLoadingMore(false);
            }
        }
    };

    const handleLoadMore = async () => {
        if (!selectedGroupId) return;
        setIsLoadingMore(true);
        const nextPage = page + 1;
        setPage(nextPage);
        await loadVariants(selectedGroupId, false, nextPage);
    };

    const handleDelete = async (id: number | string) => {
        try {
            const response = await variantService.delete(String(id));
            if (response.error) {
                toast.error(`Failed to delete variant: ${response.error}`);
                return;
            }
            if (selectedGroupId) {
                setVariants(prev => prev.filter(v => v.id !== id));
                setTotalCount(prev => prev - 1);
            }
            toast.success('Variant deleted successfully');
        } catch (error: any) {
            console.error('Error deleting variant:', error);
            toast.error(error?.message || 'Failed to delete variant');
        }
    };

    const handleEdit = (item: Variant) => {
        setFormData(item);
    };

    const handleSave = async (item: Variant | null, onClose: () => void) => {
        try {
            const { sku, color, size, price, inventoryQuantity, lowStockThreshold } = formData;

            if (item?.id) {
                // Update - only sku, color, size, price (NO inventory fields)
                const response = await variantService.update(
                    item.id,
                    color,
                    size,
                    typeof price === 'string' ? parseFloat(price) : price
                );
                if (response.error) {
                    toast.error(`Failed to update variant: ${response.error}`);
                    return;
                }
                toast.success('Variant updated successfully');
            } else {
                // Create - productGroupId, sku, color, size, price are required
                if (!selectedGroupId || !sku || !color || !size || price === undefined) {
                    toast.error('Group, SKU, Color, Size, and Price are required.');
                    return;
                }
                const response = await variantService.create(
                    selectedGroupId,
                    sku,
                    color,
                    size,
                    typeof price === 'string' ? parseFloat(price) : price,
                );
                if (response.error) {
                    toast.error(`Failed to create variant: ${response.error}`);
                    return;
                }
                toast.success('Variant created successfully');
            }
            if (selectedGroupId) {
                await loadVariants(selectedGroupId);
            }
            onClose();
            setFormData({});
        } catch (error: any) {
            console.error('Error saving variant:', error);
            toast.error(error?.message || 'Failed to save variant');
        }
    };

    const handleInventoryAdjustment = async () => {
        if (!inventoryAdjustment) return;

        try {
            const response = await variantService.adjustInventory(
                inventoryAdjustment.variantId,
                inventoryAdjustment.amount,
                inventoryAdjustment.transactionType
            );
            if (response.error) {
                toast.error(`Failed to adjust inventory: ${response.error}`);
                return;
            }
            if (selectedGroupId) {
                await loadVariants(selectedGroupId);
            }
            setShowInventoryModal(false);
            setInventoryAdjustment(null);

            const typeNames = ['Restock', 'Sale', 'Adjustment', 'Order'];
            toast.success(`Inventory adjusted by ${inventoryAdjustment.amount > 0 ? '+' : ''}${inventoryAdjustment.amount} (${typeNames[inventoryAdjustment.transactionType]})`);
        } catch (error: any) {
            console.error('Error adjusting inventory:', error);
            toast.error(error?.message || 'Failed to adjust inventory');
        }
    };

    const columns: Column<Variant>[] = [
        { key: 'id', label: 'ID' },
        { key: 'sku', label: 'SKU' },
        { key: 'color', label: 'Color' },
        { key: 'size', label: 'Size' },
        {
            key: 'price',
            label: 'Price',
            render: (item) => `$${item.price.toFixed(2)}`
        },
        {
            key: 'inventoryQuantity',
            label: 'Inventory',
            render: (item) => (
                <span className={`px-2 py-1 rounded text-xs font-medium ${item.inventoryQuantity > item.lowStockThreshold && item.inventoryQuantity > 10
                    ? 'bg-green-500/20 text-green-400'
                    : item.inventoryQuantity > item.lowStockThreshold
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                    {item.inventoryQuantity}
                </span>
            )
        },
        {
            key: 'lowStockThreshold',
            label: 'Low Stock',
            render: (item) => item.lowStockThreshold || 0
        },
        {
            key: 'lastRestockDate',
            label: 'Last Restock',
            render: (item) => item.lastRestockDate
                ? new Date(item.lastRestockDate).toLocaleDateString()
                : 'Never'
        },
    ];

    return (
        <>
            <div className="space-y-6">
                {/* Group Selector */}
                <div className="bg-[#2a2a2a] rounded-xl shadow-2xl p-6 border border-[#3a3a3a]">
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                        Select Product Group
                    </label>
                    <select
                        value={selectedGroupId || ''}
                        onChange={(e) => {
                            const rawValue = e.target.value;
                            const selectedGroup = groups.find(g => String(g.id) === rawValue);
                            const newGroupId = selectedGroup ? selectedGroup.id : rawValue;
                            setSelectedGroupId(newGroupId);
                        }}
                        className="w-full px-4 py-2.5 bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[#5a4a4a] transition"
                    >
                        {groups.map((group) => (
                            <option key={group.id} value={group.id}>
                                {group.name}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedGroupId && (
                    <BaseCRUDComponent
                        data={{ items: variants, totalCount }}
                        columns={columns}
                        customFormClose={() => setFormData({})}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                        isLoading={isLoading}
                        title="Variants"
                        onLoadMore={handleLoadMore}
                        isLoadingMore={isLoadingMore}
                        customActions={(item) => (
                            <button
                                onClick={() => {
                                    setInventoryAdjustment({ variantId: item.id, amount: 0, transactionType: 0 });
                                    setShowInventoryModal(true);
                                }}
                                className="p-2 text-purple-400 hover:bg-purple-400/10 rounded-lg transition"
                                title="Adjust Inventory"
                            >
                                <Package className="w-4 h-4" />
                            </button>
                        )}
                        renderForm={(item, onClose) => (
                            <FormWrapper
                                title="Variant"
                                onClose={onClose}
                                onSave={() => handleSave(item, onClose)}
                                isEdit={!!item}
                            >
                                <FormField
                                    label="SKU"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={(val) => setFormData({ ...formData, sku: val })}
                                    placeholder="ADIDAS-TSH-BLUE-M"
                                    required
                                />
                                <FormField
                                    label="Color"
                                    name="color"
                                    value={formData.color}
                                    onChange={(val) => setFormData({ ...formData, color: val })}
                                    placeholder="Blue"
                                    required
                                />
                                <FormField
                                    label="Size"
                                    name="size"
                                    value={formData.size}
                                    onChange={(val) => setFormData({ ...formData, size: val })}
                                    placeholder="M"
                                    required
                                />
                                <FormField
                                    label="Price"
                                    name="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(val) => setFormData({ ...formData, price: val })}
                                    placeholder="24.99"
                                    required
                                />
                                {/* <FormField
                                    label="Inventory Quantity"
                                    name="inventoryQuantity"
                                    type="number"
                                    value={formData.inventoryQuantity}
                                    onChange={(val) => setFormData({ ...formData, inventoryQuantity: val })}
                                    placeholder="22"
                                />
                                <FormField
                                    label="Low Stock Threshold"
                                    name="lowStockThreshold"
                                    type="number"
                                    value={formData.lowStockThreshold}
                                    onChange={(val) => setFormData({ ...formData, lowStockThreshold: val })}
                                    placeholder="0"
                                /> */}
                            </FormWrapper>
                        )}
                    />
                )
                }
            </div >

            {/* Inventory Adjustment Modal */}
            {
                showInventoryModal && inventoryAdjustment && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-[#2a2a2a] rounded-xl border border-[#3a3a3a] p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold text-white mb-4">Adjust Inventory</h3>

                            <div className="space-y-4">
                                <FormField
                                    label="Transaction Type"
                                    name="transactionType"
                                    type="select"
                                    value={inventoryAdjustment.transactionType}
                                    onChange={(val) => setInventoryAdjustment({ ...inventoryAdjustment, transactionType: Number(val) })}
                                    options={[
                                        { value: '0', label: 'Restock - Receiving new inventory' },
                                        { value: '1', label: 'Sale - Item sold to customer' },
                                        { value: '2', label: 'Adjustment - Correction/damage/loss' },
                                        { value: '3', label: 'Order - Reserved for order' }
                                    ]}
                                    hideEmptyOption={true}
                                    required
                                />

                                <FormField
                                    label="Adjustment Amount"
                                    name="amount"
                                    type="number"
                                    value={inventoryAdjustment.amount}
                                    onChange={(val) => setInventoryAdjustment({ ...inventoryAdjustment, amount: val })}
                                    placeholder="Enter positive or negative number"
                                    required
                                />

                                <div className="bg-[#1f1f1f] border border-[#3a3a3a] rounded-lg p-3">
                                    <p className="text-sm text-gray-400">
                                        💡 <strong className="text-white">Tip:</strong> Use positive numbers to increase stock, negative to decrease.
                                        {inventoryAdjustment.transactionType === 0 && inventoryAdjustment.amount > 0 && (
                                            <span className="block mt-1 text-green-400">✓ This will update the Last Restock Date</span>
                                        )}
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowInventoryModal(false);
                                        setInventoryAdjustment(null);
                                    }}
                                    className="flex-1 px-4 py-2 bg-[#3a3a3a] hover:bg-[#4a4a4a] text-white rounded-lg transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleInventoryAdjustment}
                                    className="flex-1 px-4 py-2 bg-[#4a3a3a] hover:bg-[#5a4a4a] text-white rounded-lg transition font-medium"
                                >
                                    Adjust
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
}