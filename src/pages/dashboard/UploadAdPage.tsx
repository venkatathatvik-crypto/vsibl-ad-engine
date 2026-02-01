import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Upload, Image, Video, X, Calendar, Clock, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { usePricingStore } from "@/store/usePricingStore";

const UploadAdPage = () => {
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

  const [pricingInput, setPricingInput] = useState({
    screenCount: 1,
    impressionsPerDay: 1000,
    totalDays: 7,
    slotPriority: 'NORMAL' as 'NORMAL' | 'HIGH' | 'PREMIUM',
    adFormat: 'IMAGE' as 'IMAGE' | 'GIF' | 'MP4' | 'WEBM',
    timeSlots: []
  });

  const [calculatePriceResult, setCalculatePriceResult] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const navigate = useNavigate();
  const { calculatePrice } = usePricingStore();

  useEffect(() => {
    const updatePrice = async () => {
      const result = await calculatePrice(pricingInput);
      setCalculatePriceResult(result);
    };
    updatePrice();
  }, [pricingInput, calculatePrice]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload an ad creative first.",
        variant: "destructive",
      });
      return;
    }

    if (!calculatePriceResult) {
      toast({
        title: "Pricing Error",
        description: "Could not calculate campaign cost. Please try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock userId for now - in reality, get from Auth Context
      const userId = "temp-user-id";

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/campaigns/create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          pricingInput
        }),
      });

      if (!response.ok) throw new Error('Failed to create campaign');

      const campaign = await response.json();

      toast({
        title: "Campaign Created & Price Locked",
        description: `Your campaign "${campaign.name}" has been submitted for review.`,
      });

      navigate("/dashboard/ads");
    } catch (err) {
      toast({
        title: "Creation failed",
        description: "There was an error creating your campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold font-display">Upload New Ad</h1>
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

            {/* Pricing Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-[#4a012f]" />
                  Campaign Pricing & Allocation
                </CardTitle>
                <CardDescription>
                  Configure your ad reach and priority. Price updates in real-time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Slot Priority</Label>
                      <select
                        className="w-full p-2 border rounded-md text-sm"
                        value={pricingInput.slotPriority}
                        onChange={(e) => setPricingInput({ ...pricingInput, slotPriority: e.target.value as any })}
                      >
                        <option value="NORMAL">Normal Priority (Standard Rate)</option>
                        <option value="HIGH">High Priority (1.5x Multiplier)</option>
                        <option value="PREMIUM">Premium Priority (2x Multiplier)</option>
                      </select>
                      <p className="text-xs text-muted-foreground">High priority ads get played first if conflicts exist.</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Screen Count ({pricingInput.screenCount})</Label>
                      <Slider
                        value={[pricingInput.screenCount]}
                        min={1}
                        max={20}
                        step={1}
                        onValueChange={([val]) => setPricingInput({ ...pricingInput, screenCount: val })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Impressions Per Day ({pricingInput.impressionsPerDay})</Label>
                      <Slider
                        value={[pricingInput.impressionsPerDay]}
                        min={100}
                        max={5000}
                        step={100}
                        onValueChange={([val]) => setPricingInput({ ...pricingInput, impressionsPerDay: val })}
                      />
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="text-center mb-4">
                      <p className="text-sm text-slate-500 uppercase font-semibold">Estimated Cost</p>
                      <h2 className="text-4xl font-bold text-[#4a012f] tabular-nums">
                        {calculatePriceResult?.finalPrice || 0} <span className="text-lg font-normal">Tokens</span>
                      </h2>
                    </div>

                    <div className="space-y-2 text-xs">
                      <p className="font-bold border-b pb-1 mb-2">Price Breakdown</p>
                      <ScrollArea className="h-40">
                        {calculatePriceResult?.breakdown.map((step: any, i: number) => (
                          <div key={i} className="flex justify-between py-1 border-b border-dashed">
                            <span className="text-slate-600">{step.factor}</span>
                            <span className="font-mono">{step.change >= 0 ? '+' : ''}{step.change.toFixed(2)}</span>
                          </div>
                        ))}
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            <div className="flex justify-end gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="bg-[#4a012f] hover:bg-[#3a0125] text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Processing..." : "Confirm & Pay"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default UploadAdPage;
