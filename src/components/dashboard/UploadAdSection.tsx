import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Video, X, Calendar, Coins, TrendingDown, Wallet, AlertCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

const UploadAdSection = () => {
    const [dragActive, setDragActive] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        startDate: "",
        endDate: "",
        startTime: "",
        endTime: "",
    });
    const { toast } = useToast();

    // Mock token balance - in real app, this would come from API/context
    const availableTokens = 12450;
    const tokenCostPerHour = 50; // Cost per hour of ad display

    // Calculate total hours and cost
    const { totalHours, estimatedCost, remainingTokens, hasEnoughTokens } = useMemo(() => {
        if (!formData.startDate || !formData.endDate || !formData.startTime || !formData.endTime) {
            return { totalHours: 0, estimatedCost: 0, remainingTokens: availableTokens, hasEnoughTokens: true };
        }

        const start = new Date(`${formData.startDate}T${formData.startTime}`);
        const end = new Date(`${formData.endDate}T${formData.endTime}`);

        if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
            return { totalHours: 0, estimatedCost: 0, remainingTokens: availableTokens, hasEnoughTokens: true };
        }

        const hours = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60));
        const cost = hours * tokenCostPerHour;
        const remaining = availableTokens - cost;
        const enough = remaining >= 0;

        return {
            totalHours: hours,
            estimatedCost: cost,
            remainingTokens: remaining,
            hasEnoughTokens: enough
        };
    }, [formData.startDate, formData.endDate, formData.startTime, formData.endTime, availableTokens]);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleFile = (selectedFile: File) => {
        const validTypes = ["image/png", "image/jpeg", "image/jpg", "video/mp4"];
        if (!validTypes.includes(selectedFile.type)) {
            toast({
                title: "Invalid file type",
                description: "Please upload PNG, JPG, JPEG, or MP4 files only.",
                variant: "destructive",
            });
            return;
        }

        setFile(selectedFile);

        if (selectedFile.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target?.result as string);
            reader.readAsDataURL(selectedFile);
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            toast({
                title: "No file selected",
                description: "Please upload an ad creative first.",
                variant: "destructive",
            });
            return;
        }

        if (!hasEnoughTokens) {
            toast({
                title: "Insufficient tokens",
                description: "You don't have enough tokens for this booking. Please buy more tokens.",
                variant: "destructive",
            });
            return;
        }

        toast({
            title: "Ad submitted for review",
            description: `Your ad is now pending approval. ${estimatedCost} tokens will be reserved.`,
        });

        // Reset form
        setFile(null);
        setPreview(null);
        setFormData({
            name: "",
            description: "",
            startDate: "",
            endDate: "",
            startTime: "",
            endTime: "",
        });
    };

    return (
        <div className="max-w-7xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {/* Header with Token Balance */}
                <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-bold font-display">Upload New Ad</h2>
                        <p className="text-muted-foreground">Create a new advertisement for the VSIBL network</p>
                    </div>

                    {/* Token Balance Card */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20"
                    >
                        <div className="p-2 rounded-lg bg-primary/20">
                            <Wallet className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Available Tokens</p>
                            <p className="text-2xl font-bold font-display">{availableTokens.toLocaleString()}</p>
                        </div>
                    </motion.div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Upload - Full Width */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Upload className="w-5 h-5 text-primary" />
                                Ad Creative
                            </CardTitle>
                            <CardDescription>
                                Upload your image or video file (PNG, JPG, JPEG, MP4)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-border hover:border-primary/50"
                                    }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {file ? (
                                    <div className="space-y-4">
                                        {preview ? (
                                            <div className="relative inline-block">
                                                <img
                                                    src={preview}
                                                    alt="Preview"
                                                    className="max-h-48 rounded-lg"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setFile(null);
                                                        setPreview(null);
                                                    }}
                                                    className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center gap-3 p-4 bg-secondary/50 rounded-lg">
                                                <Video className="w-8 h-8 text-primary" />
                                                <div className="text-left">
                                                    <p className="font-medium">{file.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setFile(null)}
                                                    className="ml-auto p-1 hover:bg-secondary rounded"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-center gap-4">
                                            <div className="p-4 rounded-xl bg-secondary/50">
                                                <Image className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                            <div className="p-4 rounded-xl bg-secondary/50">
                                                <Video className="w-8 h-8 text-muted-foreground" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-medium">Drag and drop your file here</p>
                                            <p className="text-sm text-muted-foreground">or</p>
                                        </div>
                                        <label>
                                            <input
                                                type="file"
                                                className="hidden"
                                                accept=".png,.jpg,.jpeg,.mp4"
                                                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                                            />
                                            <Button type="button" variant="outline" asChild>
                                                <span>Browse Files</span>
                                            </Button>
                                        </label>
                                        <p className="text-xs text-muted-foreground">
                                            Max file size: 50MB. Recommended: 1920x1080 for images.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Ad Details - Full Width */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ad Details</CardTitle>
                            <CardDescription>
                                Provide information about your advertisement
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Ad Name</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Summer Sale 2024"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Brief description of your ad campaign..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Two Column Layout: Schedule (Left) & Calculations (Right) */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        {/* LEFT SIDE - Schedule */}
                        <Card className="h-fit">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-primary" />
                                    Schedule Your Ad
                                </CardTitle>
                                <CardDescription>
                                    Set when your ad should run
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="startDate">Start Date</Label>
                                        <Input
                                            id="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="startTime">Start Time</Label>
                                        <Input
                                            id="startTime"
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endDate">End Date</Label>
                                        <Input
                                            id="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="endTime">End Time</Label>
                                        <Input
                                            id="endTime"
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Rate Info */}
                                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t border-border/30">
                                    <TrendingDown className="w-4 h-4" />
                                    <span>Rate: {tokenCostPerHour} tokens per hour</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* RIGHT SIDE - Cost Calculations */}
                        <Card className="h-fit sticky top-4">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Coins className="w-5 h-5 text-primary" />
                                    Cost Breakdown
                                </CardTitle>
                                <CardDescription>
                                    Live calculation based on your schedule
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {totalHours > 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ duration: 0.3 }}
                                        className="space-y-6"
                                    >
                                        {/* Duration Display */}
                                        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Clock className="w-5 h-5 text-blue-500" />
                                                <p className="text-sm font-medium text-muted-foreground">Total Duration</p>
                                            </div>
                                            <p className="text-4xl font-bold font-display text-blue-500">{totalHours}</p>
                                            <p className="text-sm text-muted-foreground">hours</p>
                                        </div>

                                        {/* Estimated Cost */}
                                        <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
                                            <div className="flex items-center gap-3 mb-2">
                                                <Coins className="w-5 h-5 text-primary" />
                                                <p className="text-sm font-medium text-muted-foreground">Estimated Cost</p>
                                            </div>
                                            <p className="text-4xl font-bold font-display text-primary">
                                                {estimatedCost.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-muted-foreground">tokens</p>
                                        </div>

                                        {/* Remaining Balance */}
                                        <div className={`p-6 rounded-xl border ${hasEnoughTokens
                                                ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20'
                                                : 'bg-gradient-to-br from-destructive/10 to-red-500/10 border-destructive/30'
                                            }`}>
                                            <div className="flex items-center gap-3 mb-2">
                                                <Wallet className={`w-5 h-5 ${hasEnoughTokens ? 'text-green-500' : 'text-destructive'}`} />
                                                <p className="text-sm font-medium text-muted-foreground">After Booking</p>
                                            </div>
                                            <p className={`text-4xl font-bold font-display ${hasEnoughTokens ? 'text-green-500' : 'text-destructive'
                                                }`}>
                                                {remainingTokens.toLocaleString()}
                                            </p>
                                            <p className="text-sm text-muted-foreground">tokens remaining</p>
                                        </div>

                                        {/* Insufficient Tokens Warning */}
                                        {!hasEnoughTokens && (
                                            <Alert variant="destructive">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                    You need <strong>{Math.abs(remainingTokens).toLocaleString()}</strong> more tokens to book this slot.
                                                    <a href="#tokens" className="underline ml-1 font-medium">Buy tokens now</a>
                                                </AlertDescription>
                                            </Alert>
                                        )}
                                    </motion.div>
                                ) : (
                                    <div className="py-12 text-center">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/50 flex items-center justify-center">
                                            <Calendar className="w-8 h-8 text-muted-foreground" />
                                        </div>
                                        <p className="text-muted-foreground">
                                            Select dates and times to see cost breakdown
                                        </p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Button
                            type="submit"
                            variant="hero"
                            size="lg"
                            disabled={!hasEnoughTokens && totalHours > 0}
                        >
                            Submit for Review
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UploadAdSection;
