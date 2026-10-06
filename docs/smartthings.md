# SmartThings Office Workspace

Giao diện Angular 17 lấy cảm hứng từ app SmartThings, tối ưu cho web nội bộ.

## Chạy project

```sh
pnpm install
pnpm start
```

Mở `http://localhost:4200`. Kiểm tra production bằng `pnpm build`.

## Cấu trúc

```text
src/app/
├── core/
│   └── models/smartthings.models.ts         # Device, Room, Routine, NavigationId
├── layout/
│   └── navigation/                         # Sidebar desktop / bottom nav mobile
├── shared/
│   └── ui/icon/                            # SVG icon dùng chung, không thêm thư viện
└── features/
    └── dashboard/
        ├── dashboard.component.{ts,html,scss} # State và bố cục dashboard
        ├── dashboard-panels.scss           # Các panel, scoped trong dashboard
        ├── components/device-card/         # Card nhận Device, phát sự kiện toggle
        └── data/dashboard.mock.ts          # Dữ liệu mẫu tách khỏi UI
```

`styles.scss` chứa design tokens, typography và accessibility dùng chung. Component giữ style riêng. Budget style mỗi component là 6 kB warning / 8 kB error để phù hợp dashboard responsive.

## Giao diện hiện tại

- Home, Devices, Life, Routines, Menu giống các mục của app tham chiếu.
- Desktop dùng sidebar; màn hình dưới 700 px dùng thanh điều hướng dưới.
- Card có tên thiết bị, phòng, trạng thái/chỉ số chính và thông tin phụ. Grid chuyển từ 3 cột sang 2 rồi 1 cột.
- Bộ lọc phòng, chọn Favorites ở Customize/Menu, bật/tắt đèn, chạy routines và chọn security mode hoạt động trên dữ liệu mẫu trong bộ nhớ.
- Refresh trang sẽ khôi phục dữ liệu mẫu. Life hiển thị cảm biến; Devices hiển thị cả thiết bị không được chọn Favorites.
- Sparkline là minh họa thiết kế, chưa có dữ liệu lịch sử.

## Deploy lên GitHub Pages

Workflow `.github/workflows/deploy-pages.yml` tự build và deploy khi push lên branch `smartthings-web`. Chỉ thư mục `dist/angular-learning/browser` được publish, nên trang sẽ hiển thị app Angular.

Thiết lập một lần:

1. Mở repo GitHub → **Settings → Pages → Build and deployment**.
2. Đổi **Source** từ **Deploy from a branch** sang **GitHub Actions**.
3. Commit và push workflow cùng tài liệu lên branch `smartthings-web`.
4. Trong **Actions**, chờ workflow **Deploy SmartThings to GitHub Pages** thành công.
5. Mở `https://thovanhien.github.io/fe/`.

Nếu environment `github-pages` chỉ cho deploy từ branch mặc định, vào **Settings → Environments → github-pages** và cho phép branch `smartthings-web`. Có thể chạy lại workflow thủ công nếu workflow đã có trên branch mặc định, chọn branch `smartthings-web` khi chạy.

Workflow dùng Node.js 24 và pnpm 12.3.4, cài dependency theo lockfile, lấy base path từ cấu hình Pages để Angular tải đúng JS/CSS dưới `/fe/` (hoặc `/` khi dùng custom domain).

Kiểm tra bản build cho URL hiện tại ở local:

```sh
pnpm exec ng build --configuration production --base-href /fe/
```

Các mục điều hướng hiện đổi state trong dashboard, chưa dùng route con nên không cần cấu hình fallback URL. Khi thêm route thật, cần xử lý deep link trên Pages, ví dụ dùng hash routing.

Bản publish hiện là UI demo với dữ liệu mẫu. Không đưa PAT hoặc dữ liệu nội bộ nhạy cảm vào bundle public.

## Bước kết nối API sau

Phiên bản này chưa gọi API, chưa nhận hoặc lưu PAT. Nhãn Demo/Sample data hiển thị rõ trên giao diện. Các thao tác điều khiển chỉ thay đổi state local.

Khi nối SmartThings, bổ sung service trong `core/services/`, adapter chuyển response sang `Device`, và các state loading/error/expired-token. PAT nên được xử lý qua backend/proxy nội bộ, không hardcode hoặc commit vào frontend. Card vẫn dùng model hiện tại; thay nguồn dữ liệu mẫu bằng service trong dashboard. Xác minh API và cơ chế token hiện hành khi triển khai phần kết nối.
