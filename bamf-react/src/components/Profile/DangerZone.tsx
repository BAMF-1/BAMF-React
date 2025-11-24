import React, { useState } from "react";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { userService } from "@/services/user.service";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "react-toastify";

const DangerZone = () => {
  const { logout } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (!password) {
      toast.error("Password is required to delete your account");
      return;
    }
    setIsLoading(true);
    const response = await userService.deleteAccount(password);

    if (response.error) {
      toast.error(response.error);
      setIsLoading(false);
      return;
    }

    toast.success("Account deleted successfully");
    await logout();
  };

  const handleCloseModal = () => {
    if (isLoading) return;
    setShowDeleteModal(false);
    setPassword("");
  };

  return (
    <div className="p-4 md:p-10 bg-[#2B2B2B] border-2 border-[#4d2222]">
      <div className="flex items-start gap-2 md:gap-4 mb-4 md:mb-6">
        <AlertTriangle
          className="w-6 h-6 md:w-7 md:h-7 text-[#ff4444] shrink-0 mt-1"
          strokeWidth={2}
        />
        <div>
          <h2 className="text-xl md:text-3xl font-bold text-white mb-2 tracking-tight">
            Danger Zone
          </h2>
          <p className="text-sm md:text-base text-gray-400 leading-relaxed">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
        </div>
      </div>
      <button
        onClick={() => setShowDeleteModal(true)}
        disabled={isLoading}
        className="px-4 md:px-8 py-3 md:py-4 w-full md:w-auto border-2 border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444] hover:text-white font-bold transition-all active:scale-95 uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Delete Account
      </button>

      {showDeleteModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
          onClick={handleCloseModal}
        >
          <div
            className="p-6 md:p-10 max-w-md w-full bg-[#171010] border-2 border-[#ff4444] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <AlertTriangle
                className="w-8 h-8 text-[#ff4444]"
                strokeWidth={2.5}
              />
              <h3 className="text-2xl font-bold text-white">Delete Account</h3>
            </div>
            <p className="text-gray-300 mb-8 leading-relaxed">
              This action cannot be undone. Enter your password to confirm
              account deletion.
            </p>
            <div className="relative mb-8">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                disabled={isLoading}
                placeholder="ENTER YOUR PASSWORD"
                className="w-full px-5 py-4 pr-12 bg-[#0f0a0a] text-white placeholder-gray-600 border-2 border-[#423F3E] focus:border-[#ff4444] outline-none transition-colors font-mono uppercase text-sm disabled:opacity-50"
              />
              <button
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 disabled:opacity-50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-4">
              <button
                onClick={handleDelete}
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-[#ff4444] hover:bg-[#cc0000] text-white font-bold transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
              >
                {isLoading ? "Deleting..." : "Delete Forever"}
              </button>
              <button
                onClick={handleCloseModal}
                disabled={isLoading}
                className="flex-1 px-6 py-4 bg-[#423F3E] hover:bg-[#504d4c] text-gray-300 font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DangerZone;