import React, { useState } from "react";
import { User, Eye, EyeOff } from "lucide-react";
import { userService } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const AccountSettings = ({
  email,
  setEmail,
}: {
  email: string;
  setEmail: (v: string) => void;
}) => {
  const { refreshUser, login } = useAuth();
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [currentPasswordForEmail, setCurrentPasswordForEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showCurrentPasswordForEmail, setShowCurrentPasswordForEmail] =
    useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveEmail = async () => {
    if (!newEmail || !newEmail.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (!currentPasswordForEmail) {
      toast.error("Current password is required to change email");
      return;
    }

    setIsLoading(true);

    const response = await userService.updateProfile({
      email: newEmail,
      currentPassword: currentPasswordForEmail,
    });

    if (response.error) {
      toast.error(response.error);
      setIsLoading(false);
      return;
    }

    // Re-login with new email to get updated token
    const loginResponse = await login(newEmail, currentPasswordForEmail);

    if (!loginResponse.success) {
      toast.warning(
        "Email updated but auto-login failed. Please log in manually with your new email."
      );
      setIsLoading(false);
      return;
    }

    toast.success("Email updated successfully!");
    setEmail(newEmail);
    setIsEditingEmail(false);
    setCurrentPasswordForEmail("");
    setIsLoading(false);
  };

  const handleSavePassword = async () => {
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    const response = await userService.updateProfile({
      currentPassword,
      newPassword,
    });

    if (response.error) {
      toast.error(response.error);
      setIsLoading(false);
      return;
    }

    toast.success("Password updated successfully!");
    setIsEditingPassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setIsLoading(false);
  };

  return (
    <div className="rounded-xl p-10 mb-10 bg-[#2B2B2B] border border-[#3a3a3a]">
      <div className="flex items-center mb-10">
        <div className="w-20 h-20 rounded-full flex items-center justify-center mr-5 bg-[#362222] ring-2 ring-[#4a3535]">
          <User className="w-10 h-10 text-gray-200" strokeWidth={2.5} />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">
            Account Settings
          </h2>
          <p className="text-gray-400 mt-1">Manage your login credentials</p>
        </div>
      </div>

      <div className="space-y-8">
        {/* Email Section */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
            Email Address
          </label>
          {!isEditingEmail ? (
            <div className="flex gap-3">
              <input
                type="email"
                value={email}
                disabled
                className="flex-1 px-5 py-3.5 rounded-lg text-white font-medium bg-[#423F3E] opacity-70 cursor-not-allowed"
              />
              <button
                onClick={() => {
                  setIsEditingEmail(true);
                  setNewEmail(email);
                }}
                disabled={isLoading}
                className="px-8 py-3.5 rounded-lg bg-[#362222] hover:bg-[#4a3535] text-white font-semibold transition-all hover:scale-105 active:scale-95 border border-[#4a3535] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Edit
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={isLoading}
                placeholder="New email address"
                className="w-full px-5 py-3.5 rounded-lg text-white font-medium bg-[#362222] border-2 border-[#4a3535] focus:outline-none focus:ring-2 focus:ring-[#ff4444] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <div className="relative">
                <input
                  type={showCurrentPasswordForEmail ? "text" : "password"}
                  value={currentPasswordForEmail}
                  onChange={(e) => setCurrentPasswordForEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="Current password (required)"
                  className="w-full px-5 py-3.5 pr-12 rounded-lg text-white font-medium bg-[#362222] border-2 border-[#4a3535] focus:outline-none focus:ring-2 focus:ring-[#ff4444] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowCurrentPasswordForEmail(!showCurrentPasswordForEmail)
                  }
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
                  aria-label={
                    showCurrentPasswordForEmail
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showCurrentPasswordForEmail ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSaveEmail}
                  disabled={isLoading}
                  className="px-8 py-3.5 rounded-lg bg-[#ff4444] hover:bg-[#cc0000] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={() => {
                    setIsEditingEmail(false);
                    setCurrentPasswordForEmail("");
                  }}
                  disabled={isLoading}
                  className="px-8 py-3.5 rounded-lg bg-[#423F3E] hover:bg-[#504d4c] text-gray-300 font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Password Section */}
        <div>
          <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
            Password
          </label>
          {!isEditingPassword ? (
            <button
              onClick={() => setIsEditingPassword(true)}
              disabled={isLoading}
              className="px-8 py-3.5 rounded-lg bg-[#362222] hover:bg-[#4a3535] text-white font-semibold transition-all hover:scale-105 active:scale-95 border border-[#4a3535] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Change Password
            </button>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="Current password"
                  className="w-full px-5 py-3.5 pr-12 rounded-lg text-white font-medium bg-[#362222] border-2 border-[#4a3535] focus:outline-none focus:ring-2 focus:ring-[#ff4444] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
                  aria-label={
                    showCurrentPassword ? "Hide password" : "Show password"
                  }
                >
                  {showCurrentPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={isLoading}
                  placeholder="New password (min. 8 characters)"
                  className="w-full px-5 py-3.5 pr-12 rounded-lg text-white font-medium bg-[#362222] border-2 border-[#4a3535] focus:outline-none focus:ring-2 focus:ring-[#ff4444] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  disabled={isLoading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors disabled:opacity-50"
                  aria-label={
                    showNewPassword ? "Hide password" : "Show password"
                  }
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSavePassword}
                  disabled={isLoading}
                  className="px-8 py-3.5 rounded-lg bg-[#ff4444] hover:bg-[#cc0000] text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Save Password"}
                </button>
                <button
                  onClick={() => {
                    setIsEditingPassword(false);
                    setCurrentPassword("");
                    setNewPassword("");
                  }}
                  disabled={isLoading}
                  className="px-8 py-3.5 rounded-lg bg-[#423F3E] hover:bg-[#504d4c] text-gray-300 font-semibold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
