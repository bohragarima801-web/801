'use client';

import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Trash2, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AddressManager({ initialAddresses }: { initialAddresses: any[] }) {
  const router = useRouter();
  const [addresses, setAddresses] = useState(initialAddresses);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    line1: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
    type: 'HOME',
    isDefault: false
  });

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this address?')) return;
    try {
      await fetch(`/api/profile/addresses?id=${id}`, { method: 'DELETE' });
      setAddresses(addresses.filter(a => a.id !== id));
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/profile/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const newAddr = await res.json();
        if (newAddr.isDefault) {
          setAddresses([newAddr, ...addresses.map(a => ({ ...a, isDefault: false }))]);
        } else {
          setAddresses([...addresses, newAddr]);
        }
        setIsAdding(false);
        setFormData({
          fullName: '', phone: '', line1: '', city: '', state: '', pincode: '', country: 'India', type: 'HOME', isDefault: false
        });
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {addresses.length === 0 && !isAdding ? (
        <Card className="flex flex-col items-center justify-center p-12 text-center">
          <MapPin className="h-12 w-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="font-semibold text-lg">No Addresses Saved</h3>
          <p className="text-sm text-muted-foreground max-w-sm mt-1 mb-4">
            You haven't added any shipping or billing addresses to your account yet.
          </p>
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="h-4 w-4 mr-2" /> Add Address
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className="relative">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex justify-between items-start">
                  <span>{addr.fullName} {addr.isDefault && <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">Default</span>}</span>
                  <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => handleDelete(addr.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardTitle>
                <div className="text-sm font-medium text-muted-foreground bg-muted w-max px-2 py-0.5 rounded">{addr.type}</div>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p>{addr.phone}</p>
                <p>{addr.line1}</p>
                {addr.line2 && <p>{addr.line2}</p>}
                <p>{addr.city}, {addr.state} {addr.pincode}</p>
                <p>{addr.country}</p>
              </CardContent>
            </Card>
          ))}
          {!isAdding && addresses.length > 0 && (
            <Card className="flex flex-col items-center justify-center p-6 border-dashed border-2 cursor-pointer hover:bg-muted/50 transition-colors" onClick={() => setIsAdding(true)}>
              <Plus className="h-8 w-8 text-muted-foreground mb-2 opacity-50" />
              <h3 className="font-medium">Add New Address</h3>
            </Card>
          )}
        </div>
      )}

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Address</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Address Line 1</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pincode</label>
                  <input required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address Type</label>
                  <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="HOME">Home</option>
                    <option value="WORK">Work</option>
                    <option value="SHIPPING">Shipping Only</option>
                    <option value="BILLING">Billing Only</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="flex items-center space-x-2 md:col-span-2">
                  <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="h-4 w-4 rounded border-gray-300" />
                  <label htmlFor="isDefault" className="text-sm font-medium">Set as default address</label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Address'}</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
