import React, { useState, useRef, useEffect } from "react";
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
import { Loader2, User, Mail, Camera, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { updateProfile, updateEmail } from "firebase/auth";
import { useToast } from "@/components/ui/use-toast";

// Interface for API profile response
interface ProfileApiResponse {
  status: boolean;
  status_message: string;
  payload: {
    id: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    mobile: string;
    user_type: string;
    profile_img: string;
  };
  exception: string | null;
}

const Profile = () => {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  // Profile data state
  const [profileData, setProfileData] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  
  // Form states for API users
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [profileImage, setProfileImage] = useState("");
  
  // Form states for Firebase users
  const [displayName, setDisplayName] = useState(currentUser?.displayName || "");
  const [firebaseEmail, setFirebaseEmail] = useState(currentUser?.email || "");
  const [firebaseProfileImage, setFirebaseProfileImage] = useState(currentUser?.photoURL || "");
  
  const [isUpdating, setIsUpdating] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const fileInputRef = useRef(null);

  // Check if user is using API authentication
  const isApiUser = currentUser?.providerId === "api" || localStorage.getItem("isLoggedIn") === "true";

  // Fetch profile data from API
  const fetchProfileData = async () => {
    if (!isApiUser) return;

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      toast({
        title: "Authentication Error",
        description: "No access token found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoadingProfile(true);
    try {
      console.log("Fetching profile data from API...");
      
      const response = await fetch("/accounts/profile/", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
      });

      if (response.ok) {
        const data: ProfileApiResponse = await response.json();
        
        if (data.status && data.payload) {
          console.log("Profile data fetched successfully:", data.payload);
          setProfileData(data.payload);
          
          // Update form states with API data
          setFirstName(data.payload.first_name || "");
          setLastName(data.payload.last_name || "");
          setUsername(data.payload.username || "");
          setEmail(data.payload.email || "");
          setMobile(data.payload.mobile || "");
          setProfileImage(data.payload.profile_img || "");
          
          toast({
            title: "Profile Loaded",
            description: data.status_message || "Profile data loaded successfully.",
          });
        } else {
          throw new Error(data.status_message || "Failed to load profile data");
        }
      } else {
        if (response.status === 401) {
          toast({
            title: "Authentication Error",
            description: "Your session has expired. Please log in again.",
            variant: "destructive",
          });
          // You might want to logout the user here
          return;
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.status_message || 
          errorData.message || 
          `Failed to fetch profile (${response.status})`
        );
      }
    } catch (error: any) {
      console.error("Error fetching profile:", error);
      
      let errorMessage = "Failed to load profile data.";
      if (error.message.includes("Failed to fetch")) {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Error Loading Profile",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Load profile data on component mount
  useEffect(() => {
    if (isApiUser) {
      fetchProfileData();
    } else {
      // For Firebase users, use existing data
      setDisplayName(currentUser?.displayName || "");
      setFirebaseEmail(currentUser?.email || "");
      setFirebaseProfileImage(currentUser?.photoURL || "");
    }
  }, [currentUser, isApiUser]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === "string") {
          if (isApiUser) {
            setProfileImage(result);
          } else {
            setFirebaseProfileImage(result);
          }
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

      if (isApiUser) {
        // Handle API profile update (you'll need to implement the update API endpoint)
        toast({
          title: "Update Notice",
          description: "Profile update via API will be implemented when the update endpoint is available.",
        });
      } else {
        // Handle Firebase profile update
        let photoURL = currentUser.photoURL;

        if (imageFile) {
          photoURL = firebaseProfileImage;
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

        if (firebaseEmail !== currentUser.email) {
          await updateEmail(currentUser, firebaseEmail);
        }

        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Show loading state while fetching profile data
  if (isApiUser && isLoadingProfile && !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
        <Navbar />
        <div className="pt-24 pb-16 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-8 w-8 animate-spin text-gray-600" />
              <p className="text-gray-600">Loading profile data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    {isApiUser 
                      ? "View and manage your account details" 
                      : "Update your account details and profile information"
                    }
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                        {(isApiUser ? profileImage : firebaseProfileImage) ? (
                          <img
                            src={isApiUser ? profileImage : firebaseProfileImage}
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="h-12 w-12 text-gray-400" />
                        )}
                      </div>
                      {!isApiUser && (
                        <button
                          onClick={handleCameraClick}
                          className="absolute -bottom-1 -right-1 bg-black text-white p-2 rounded-full shadow-md hover:bg-gray-800 transition-colors"
                        >
                          <Camera className="h-4 w-4" />
                        </button>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {isApiUser ? (
                    // API User Fields
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="pl-10"
                            readOnly={true}
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            readOnly={true}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            readOnly={true}
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
                            readOnly={true}
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                          <Input
                            id="mobile"
                            type="tel"
                            value={mobile}
                            onChange={(e) => setMobile(e.target.value)}
                            className="pl-10"
                            readOnly={true}
                          />
                        </div>
                      </div>

                      {profileData && (
                        <div className="space-y-2">
                          <Label>User Type</Label>
                          <div className="text-sm text-gray-600 capitalize">
                            {profileData.user_type}
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Firebase User Fields
                    <>
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
                            value={firebaseEmail}
                            onChange={(e) => setFirebaseEmail(e.target.value)}
                            className="pl-10"
                          />
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>

                <CardFooter className="flex justify-between">
                  {isApiUser && (
                    <Button
                      onClick={fetchProfileData}
                      variant="outline"
                      disabled={isLoadingProfile}
                    >
                      {isLoadingProfile ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Refreshing...
                        </span>
                      ) : (
                        "Refresh Profile"
                      )}
                    </Button>
                  )}
                  
                  {!isApiUser && (
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
                  )}
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