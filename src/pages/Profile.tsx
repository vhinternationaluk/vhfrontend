import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, User, Mail, Camera } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { updateProfile, updateEmail } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

const Profile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(
    currentUser?.displayName || ""
  );
  const [email, setEmail] = useState(currentUser?.email || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileImage, setProfileImage] = useState(currentUser?.photoURL || "");
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          setProfileImage(result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
    }
  };

  const handleCameraClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpdateProfile = async () => {
    if (!currentUser) return;

    try {
      setIsUpdating(true);

      let photoURL = currentUser.photoURL;

      if (imageFile) {
        photoURL = profileImage;
      }

      const updates: { displayName?: string; photoURL?: string } = {};
      if (displayName !== currentUser.displayName) {
        updates.displayName = displayName;
      }
      if (photoURL !== currentUser.photoURL) {
        updates.photoURL = photoURL;
      }

      if (Object.keys(updates).length > 0) {
        await updateProfile(currentUser, updates);
      }

      if (email !== currentUser.email) {
        await updateEmail(currentUser, email);
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      <div className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your account details and profile information
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      <button
                        onClick={handleCameraClick}
                        className="absolute -bottom-1 -right-1 bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                      >
                        <Camera className="h-4 w-4" />
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={isUpdating}
                    className="ml-auto bg-black hover:bg-black/80"
                  >
                    {isUpdating ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </span>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="border-0 shadow-lg bg-white/90 backdrop-blur-md">
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your password and account security
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="password">Current Password</Label>
                    <Input id="password" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                      Confirm New Password
                    </Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                </CardContent>

                <CardFooter>
                  <Button className="ml-auto bg-black hover:bg-black/80">
                    Update Password
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
