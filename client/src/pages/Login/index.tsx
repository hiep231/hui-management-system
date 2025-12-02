import { api } from "@/services/api";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "zmp-ui";
import { Phone, Lock, Eye, EyeOff, ArrowRight, Wallet } from "lucide-react";
import { cn } from "@/utils";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { openSnackbar } = useSnackbar();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone || !password) {
      openSnackbar({ text: "Vui lòng nhập đầy đủ thông tin", type: "warning" });
      return;
    }

    setLoading(true);
    try {
      const res = await api.login(phone, password);
      if (res.success) {
        openSnackbar({
          text: "Đăng nhập thành công!",
          type: "success",
        });
        navigate("/");
      } else {
        throw new Error(res.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      openSnackbar({
        text: error.message || "Có lỗi xảy ra",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12 lg:px-8">
      {/* Header: Logo & Title */}
      <div className="sm:mx-auto sm:w-full sm:max-w-sm text-center mb-10">
        <div className="mx-auto h-16 w-16 bg-gradient-to-br from-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
          <Wallet className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Quản Lý Hụi
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Đăng nhập để quản lý dây hụi của bạn
        </p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleLogin}>
          {/* Phone Input */}
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium leading-6 text-gray-900 mb-1.5"
            >
              Số điện thoại
            </label>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-xl border-0 py-3 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white transition-shadow"
              />
            </div>
          </div>

          {/* Password Input */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Mật khẩu
              </label>
            </div>
            <div className="relative mt-2 rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border-0 py-3 pl-10 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary sm:text-sm sm:leading-6 bg-white transition-shadow"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" aria-hidden="true" />
                ) : (
                  <Eye className="h-5 w-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex w-full justify-center items-center gap-2 rounded-xl px-3 py-3.5 text-sm font-bold leading-6 text-white shadow-sm transition-all active:scale-[0.98]",
                loading
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-primary hover:bg-primary-dark shadow-lg shadow-primary/30"
              )}
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          <button
            onClick={() => navigate("/register")}
            className="font-bold leading-6 text-primary hover:text-emerald-600 transition-colors"
          >
            Đăng ký ngay
          </button>
        </p>
      </div>
    </div>
  );
}
