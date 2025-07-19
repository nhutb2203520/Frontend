import { jwtDecode } from "jwt-decode";

export function decodeToken(token) {
  try {
    const decoded = jwtDecode(token);
    return decoded; // chứa thông tin user, thời gian hết hạn, ...
  } catch (error) {
    console.error("Lỗi giải mã token:", error);
    return null;
  }
}
