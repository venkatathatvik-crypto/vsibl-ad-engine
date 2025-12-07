import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Upload, Image, Video, X, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

        toast({
            title: "Ad submitted for review",
            description: "Your ad is now pending approval. We'll notify you once it's approved.",
        });

        // Reset form or redirect logic if needed
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
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
            >
                {/* Header */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold font-display">Upload New Ad</h2>
                    <p className="text-muted-foreground">Create a new advertisement for the VSIBL network</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* File Upload */}
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

                    {/* Ad Details */}
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

                    {/* Schedule */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-primary" />
                                Schedule
                            </CardTitle>
                            <CardDescription>
                                Set when your ad should run
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-6">
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
                        </CardContent>
                    </Card>

                    {/* Submit */}
                    <div className="flex justify-end gap-4">
                        <Button type="submit" variant="hero" size="lg">
                            Submit for Review
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UploadAdSection;
