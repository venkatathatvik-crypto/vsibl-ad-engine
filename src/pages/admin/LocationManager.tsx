import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, MapPin, Loader2, Save, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { motion, AnimatePresence } from 'framer-motion';

interface Location {
    id: string;
    name: string;
    locationString: string;
    tokensPerHour: number;
    status: string;
}

const LocationManager = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [showAddForm, setShowAddForm] = useState(false);
    const [newLocation, setNewLocation] = useState({
        name: '',
        locationString: '',
        tokensPerHour: 50,
        status: 'Available'
    });

    const API_URL = `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/admin/locations`;

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('auth_token'); // Assuming auth token is stored here
            const response = await fetch(API_URL, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to fetch locations');
            const data = await response.json();
            setLocations(data);
        } catch (err) {
            toast.error('Error loading locations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLocations();
    }, []);

    const handleAddLocation = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newLocation),
            });
            if (!response.ok) throw new Error('Failed to create location');
            toast.success('Location added successfully');
            setShowAddForm(false);
            setNewLocation({ name: '', locationString: '', tokensPerHour: 50, status: 'Available' });
            fetchLocations();
        } catch (err) {
            toast.error('Error adding location');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteLocation = async (id: string) => {
        if (!confirm('Are you sure you want to delete this location?')) return;

        try {
            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) throw new Error('Failed to delete location');
            toast.success('Location deleted');
            fetchLocations();
        } catch (err) {
            toast.error('Error deleting location');
        }
    };

    const handleUpdateTokenCost = async (id: string, cost: number) => {
        try {
            const location = locations.find(l => l.id === id);
            if (!location) return;

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...location, tokensPerHour: cost }),
            });
            if (!response.ok) throw new Error('Failed to update cost');
            toast.success('Token cost updated');
            // Optimistic update
            setLocations(locations.map(l => l.id === id ? { ...l, tokensPerHour: cost } : l));
        } catch (err) {
            toast.error('Error updating cost');
        }
    };

    return (
        <DashboardLayout isAdmin>
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight font-display">Screen Locations</h1>
                        <p className="text-muted-foreground mt-1">Manage global screen network and individual slot costs.</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            className="gap-2 border-border/50 hover:bg-secondary"
                            onClick={fetchLocations}
                            disabled={loading}
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                            Refresh
                        </Button>
                        <Button
                            className="bg-primary hover:bg-primary-glow text-white gap-2 shadow-glow transition-all duration-300"
                            onClick={() => setShowAddForm(!showAddForm)}
                        >
                            <Plus className="w-4 h-4" />
                            Add Location
                        </Button>
                    </div>
                </div>

                <AnimatePresence>
                    {showAddForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <Card className="glass-card border-primary/20">
                                <CardHeader>
                                    <CardTitle>Add New Display Location</CardTitle>
                                    <CardDescription>Enter details for a new screen in the VSIBL network.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleAddLocation} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                                        <div className="space-y-2">
                                            <Label>Screen Name</Label>
                                            <Input
                                                placeholder="e.g. Marina Front"
                                                value={newLocation.name}
                                                onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Address/Area</Label>
                                            <Input
                                                placeholder="e.g. Chennai, OMR"
                                                value={newLocation.locationString}
                                                onChange={(e) => setNewLocation({ ...newLocation, locationString: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Tokens / Hour</Label>
                                            <Input
                                                type="number"
                                                value={newLocation.tokensPerHour}
                                                onChange={(e) => setNewLocation({ ...newLocation, tokensPerHour: parseInt(e.target.value) })}
                                                required
                                            />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button type="submit" className="flex-1" disabled={isSaving}>
                                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                                                Save Screen
                                            </Button>
                                            <Button type="button" variant="ghost" onClick={() => setShowAddForm(false)}>Cancel</Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    )}
                </AnimatePresence>

                <Card className="glass-card overflow-hidden">
                    <Table>
                        <TableHeader className="bg-secondary/30">
                            <TableRow className="hover:bg-transparent border-border/50">
                                <TableHead className="text-muted-foreground">Screen Details</TableHead>
                                <TableHead className="text-muted-foreground">Address</TableHead>
                                <TableHead className="text-muted-foreground">Status</TableHead>
                                <TableHead className="text-muted-foreground">Token Cost / Hr</TableHead>
                                <TableHead className="text-right text-muted-foreground pr-6">Management</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && locations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 opacity-20" />
                                        Syncing locations...
                                    </TableCell>
                                </TableRow>
                            ) : locations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        No locations found. Add your first screen to start.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                locations.map((loc) => (
                                    <TableRow key={loc.id} className="hover:bg-secondary/20 border-border/30">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                                    <MapPin className="w-5 h-5 text-primary" />
                                                </div>
                                                <div className="font-bold text-white">{loc.name}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {loc.locationString}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={
                                                    loc.status === 'Available'
                                                        ? 'bg-success/10 text-success border-success/20'
                                                        : 'bg-warning/10 text-warning border-warning/20'
                                                }
                                            >
                                                {loc.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="number"
                                                    className="w-20 h-8 bg-background/50 border-border/40 focus:border-primary font-mono font-bold"
                                                    defaultValue={loc.tokensPerHour}
                                                    onBlur={(e) => handleUpdateTokenCost(loc.id, parseInt(e.target.value))}
                                                />
                                                <span className="text-[10px] text-muted-foreground uppercase font-black">TKN</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                                                onClick={() => handleDeleteLocation(loc.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default LocationManager;
