# 🌾 Game Nông Trại: Tài liệu thiết kế hệ thống hoàn chỉnh

> **Đã chốt:** Nền tảng **Web** · **Real-time** (ngày tự chạy) · **Single-player, không online** · Phong cách **cute/cozy** · **Không có monetization**. Mọi con số là **số mẫu** để cân bằng lại sau.

## Mục lục

- **Phần I. Thiết kế cốt lõi**
  - I.1 Vòng lặp cốt lõi (Core Loop)
  - I.2 Cấu trúc các Tab
  - I.3 Chi tiết từng hệ thống
  - I.4 Kinh tế & cân bằng
  - I.5 Tiến trình & mở khóa
  - I.6 Thời gian trong game (Real-time)
  - I.7 Cấu trúc dữ liệu (ví dụ)
  - I.8 Hướng kỹ thuật cho bản Web
  - I.9 Phong cách Cute (Art & Cảm giác chơi)
  - I.10 Ảnh hưởng của các quyết định đã chốt
- **Phần II. Tính khả biến: mỗi lần chơi một khác**
  - II.1 Nguyên tắc chung
  - II.2 Tổng quan 5 lớp
  - II.3 Lớp 1: Đất & bản đồ
  - II.4 Lớp 2: Tính cách chợ
  - II.5 Lớp 3: Hồ sơ khởi đầu
  - II.6 Lớp 4: Mục tiêu mùa
  - II.7 Lớp 5: Chuỗi sự kiện có hệ quả
  - II.8 Kỹ thuật & bảo đảm cân bằng
  - II.9 Chế độ chơi (tùy chọn)
- **Phần III. Chướng ngại & Rủi ro**
  - III.1 Nguyên tắc thiết kế
  - III.2 Danh mục chướng ngại
  - III.3 Cơ chế chung
  - III.4 Xã hội đen: Băng Mèo Chợ Đen
  - III.5 Thuế
  - III.6 Công trình & công cụ phòng vệ
  - III.7 Tích hợp với real-time và UI
  - III.8 Cấu trúc dữ liệu mẫu
- **Phần IV. Câu cá & Ao cá**
  - IV.1 Vai trò & nguyên tắc
  - IV.2 Vùng nước
  - IV.3 Câu cá (minigame)
  - IV.4 Dụng cụ
  - IV.5 Bảng cá mẫu
  - IV.6 Ao cá (nuôi cá)
  - IV.7 Chế biến, kho, vận tải, chợ
  - IV.8 Sổ cá & sự kiện
  - IV.9 Chướng ngại liên quan
  - IV.10 Dữ liệu mẫu
  - IV.11 Chuẩn bị chỗ cắm (làm từ MVP, không cần code tính năng)
- **Phần V. Lộ trình tổng hợp & việc cần làm tiếp**
  - V.1 Lộ trình
  - V.2 Việc cần làm tiếp

## Phần I. Thiết kế cốt lõi

### I.1 Vòng lặp cốt lõi (Core Loop)

```
Mua giống/vật tư → Gieo trồng & chăn nuôi → Chăm sóc → Thu hoạch
→ Cất kho → (Chế biến) → Vận chuyển → Bán ở chợ → Tiền + XP → Mở rộng
```

Điểm hấp dẫn nằm ở **các quyết định**: trồng gì theo mùa, bán ngay hay chờ giá lên, chế biến hay bán thô, nâng cấp xe hay mở thêm đất.

### I.2 Cấu trúc các Tab

| Tab | Mục đích | Chức năng chính | Liên kết với |
| --- | --- | --- | --- |
| **Đất & Nước** | Trồng trọt, ao cá, câu cá | Cày, gieo, tưới, bón, thu hoạch, nuôi/câu cá | Cửa hàng (đầu vào), Kho (đầu ra) |
| **Chuồng trại** | Chăn nuôi | Cho ăn, uống, thu sản phẩm, chữa bệnh | Cửa hàng, Kho |
| **Kho** | Lưu trữ | Xem tồn, sức chứa, hạn sử dụng | Mọi tab |
| **Chế biến** | Tăng giá trị | Xay bột, làm bánh, phô mai... | Kho, Chợ |
| **Cửa hàng** | Mua đầu vào | Hạt giống, phân bón, thuốc, thức ăn, con giống, công cụ | Đồng ruộng, Chuồng trại |
| **Vận tải** | Đưa hàng đi bán | Chọn xe, chọn tuyến, xếp hàng, theo dõi chuyến | Kho, Chợ |
| **Chợ** | Bán hàng | Xem giá, đơn hàng, bán, thương lái | Vận tải |
| **Làng** | Xã hội & rủi ro | Bảng tin, dự báo, thuế, bảo hiểm, quan hệ NPC | Chợ, Tiến trình |
| **Tiến trình** | Mục tiêu dài hạn | Nhiệm vụ, thành tựu, mở khóa, thống kê | Tất cả |

Thanh trên cùng luôn hiển thị: 💰 Tiền · ⭐ Level/XP · 📅 Ngày/Mùa · ☁️ Thời tiết.

### I.3 Chi tiết từng hệ thống

#### I.3.1 Đồng ruộng

> Tab này mở rộng thành **Đất & Nước**: loại đất (Phần II), thiên tai (Phần III), ao cá & câu cá (Phần IV).

- Đất chia thành **ô (plot)**. Mỗi ô có: `độ phì (0–100)`, `độ ẩm (0–100)`, `cây đang trồng`.
- **Trạng thái ô:** Trống → Đã cày → Đã gieo → Đang lớn → Chín → (Héo nếu để quá hạn).
- **Đầu vào:** hạt giống (bắt buộc), nước (tưới tay/hệ thống tưới), phân bón (tùy chọn).
- **Tác động:**
  - Phân bón: +% sản lượng hoặc −% thời gian lớn; làm tăng độ phì.
  - Trồng liên tục 1 loại → độ phì giảm → bắt buộc **luân canh** hoặc bón phân.
  - Thời tiết: mưa tự tưới, hạn hán tăng nhu cầu nước, bão có thể phá cây (có thể phòng bằng nhà lưới).
  - Sâu bệnh xuất hiện ngẫu nhiên → cần thuốc, nếu bỏ mặc mất 30–50% sản lượng.
- **Mùa vụ:** Xuân / Hạ / Thu / Đông, trồng sai mùa → thời gian lớn ×1.5 hoặc sản lượng ×0.6.
- **Mở rộng:** mua thêm ô đất, thuê nhân công (tự động tưới/thu hoạch), nâng cấp hệ thống tưới.

**Công thức sản lượng:**

```
Sản lượng = Sản_lượng_gốc × Hệ_số_phì × Hệ_số_nước × Hệ_số_mùa × (1 + Bonus_phân)
```

#### I.3.2 Chuồng trại

> Dịch bệnh và phòng vệ xem Phần III; ao cá hoạt động tương tự chuồng trại (Phần IV).

- Mỗi loại chuồng có **sức chứa** và nâng cấp được (gà → bò → cừu → ong).
- Vật nuôi có `đói`, `khát`, `sức khỏe`, `hài lòng`. Hài lòng cao → sản phẩm chất lượng cao hơn.
- Sản phẩm: trứng (hằng ngày), sữa (hằng ngày), len (vài ngày), thịt (bán con).
- Bỏ đói quá 2 ngày → giảm sản lượng; quá 4 ngày → ốm, cần thuốc. Vật nuôi **không chết** (hợp phong cách cozy).
- Dịch bệnh ngẫu nhiên, cần thuốc thú y và vệ sinh chuồng.

| Vật nuôi | Giá mua | Thức ăn/ngày | Sản phẩm | Giá bán SP |
| --- | --- | --- | --- | --- |
| Gà | 60 | 1 | 1 trứng/ngày | 8 |
| Bò | 500 | 2 + nước | 2 sữa/ngày | 14 |
| Cừu | 350 | 2 | 1 len/3 ngày | 30 |

#### I.3.3 Kho

- Có **sức chứa tối đa** (nâng cấp bằng tiền). Đầy kho thì thu hoạch không cất được.
- Hàng tươi (rau, sữa, trứng) có **hạn sử dụng**, quá hạn mất giá rồi hỏng. Hàng khô (lúa, ngô) bền hơn.
- Có thể xây kho lạnh để kéo dài hạn hàng tươi.
- Gợi ý: kho là "van điều áp" của game, khiến người chơi phải cân nhắc bán ngay hay tích trữ chờ giá.

#### I.3.4 Cửa hàng (mua đầu vào)

- Danh mục: **Hạt giống · Phân bón · Thuốc BVTV · Thức ăn · Con giống · Công cụ/máy móc · Nâng cấp**.
- Mở khóa theo level (cây hiếm, phân cao cấp, máy móc).
- Giá cố định hoặc dao động nhẹ ±10% theo mùa (hạt giống rẻ hơn trước vụ).
- Có thể có **hàng khuyến mãi theo ngày** để tạo lý do vào mỗi ngày.
- Mua theo số lượng, có nút "mua đủ cho N ô".

#### I.3.5 Chế biến

- Công thức: `nguyên liệu + thời gian + (nhiên liệu/điện) → thành phẩm`.
- Ví dụ: Lúa mì → Bột (1 ngày) → Bánh mì (1 ngày). Sữa → Phô mai (3 ngày). Dâu → Mứt.
- Thành phẩm giá cao hơn nguyên liệu 1.5–3 lần, nhưng chiếm công suất máy và thời gian.
- Mỗi máy có hàng đợi (queue), nâng cấp để tăng số slot song song.

#### I.3.6 Vận tải

> Rủi ro cướp đường, tuyến nguy hiểm và hộ tống xem Phần III.

- Hàng phải được **vận chuyển** tới chợ mới bán được (trừ chợ làng gần nhà).
- Mỗi phương tiện có: `tải trọng`, `tốc độ`, `chi phí/chuyến`, `loại hàng chở được`.

| Phương tiện | Tải trọng | Thời gian | Chi phí | Ghi chú |
| --- | --- | --- | --- | --- |
| Xe đẩy tay | 20 | tức thì (chợ làng) | 0 | Mặc định |
| Xe bò | 60 | 1 ngày | 10 | Chợ huyện |
| Xe tải nhỏ | 200 | 1 ngày | 40 | Chợ thị trấn |
| Xe lạnh | 150 | 1 ngày | 80 | Chở hàng tươi, không bị hỏng |

- Có thể có **tuyến đường** (làng / huyện / thành phố): đi xa → giá bán cao hơn nhưng tốn thời gian & phí.
- Rủi ro: hàng tươi chở xe thường bị giảm chất lượng; sự kiện hỏng xe/mưa lũ làm chậm chuyến.
- Hàng chờ xe chuyến trước về nên xe là **nút thắt** buộc người chơi đầu tư mở rộng đội xe.

#### I.3.7 Chợ (bán hàng)

> Sở thích/tính cách chợ (Phần II), thuế & xã hội đen (Phần III), nhóm hàng cá (Phần IV).

- Mỗi chợ có bảng giá riêng theo **cung – cầu**:

```
Giá bán = Giá_gốc × Hệ_số_chất_lượng × Hệ_số_cầu × Hệ_số_mùa
Hệ_số_cầu: mỗi đơn vị bán ra giảm 3% (sàn 60%), mỗi ngày hồi phục 10%
```

- Các kênh bán:
  1. **Bán thẳng** theo giá thị trường (nhanh, giá trung bình).
  2. **Đơn hàng (Order board):** yêu cầu số lượng + hạn, giá cao hơn 20–50%, thưởng XP.
  3. **Thương lái đến nhà:** mua cả lô giá thấp, không cần vận tải.
  4. **Sự kiện/lễ hội:** nhu cầu một mặt hàng tăng mạnh trong vài ngày.
- Bán cùng loại hàng liên tục sẽ bão hòa → khuyến khích **đa dạng hóa**.

### I.4 Kinh tế & cân bằng

**Nguồn tiền (Source):** bán nông sản, đơn hàng, nhiệm vụ, sự kiện. **Chỗ tiêu (Sink):** hạt giống, thức ăn, phân thuốc, nhiên liệu, nâng cấp, mở rộng đất, thuê công, phí chợ, thuế, phí bảo hiểm, chi phí phòng vệ (Phần III).

Nguyên tắc: mỗi nâng cấp cần được **hoàn vốn trong 2–5 ngày chơi** ở giai đoạn đầu, kéo dài dần về sau.

**Bảng cây trồng mẫu:**

| Cây | Giá giống | Thời gian | Sản lượng | Giá bán | Lãi/ô | Mùa | Level |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Lúa mì | 10 | 3 ngày | 4 | 6 | 14 | Mọi mùa | 1 |
| Cà chua | 20 | 4 ngày | 5 | 8 | 20 | Hạ | 3 |
| Ngô | 25 | 5 ngày | 6 | 9 | 29 | Hạ | 5 |
| Dâu tây | 40 | 6 ngày | 6 (thu lại) | 14 | 44+ | Xuân | 8 |

### I.5 Tiến trình & mở khóa

| Level | Mở khóa |
| --- | --- |
| 1 | Đồng ruộng cơ bản, cửa hàng, chợ làng, 4 ô đất |
| 3 | Chuồng gà, cây thứ 2, kho nâng cấp lần 1 |
| 5 | Chế biến (xưởng bột), xe bò, chợ huyện |
| 8 | Chuồng bò, hệ thống tưới, thuê nhân công |
| 12 | Xe tải, kho lạnh, thị trấn, đơn hàng lớn |
| 15+ | Cây/giống đặc biệt, xe lạnh, chợ thành phố, sự kiện |

Nguồn XP: thu hoạch, giao đơn hàng, hoàn thành nhiệm vụ.

### I.6 Thời gian trong game (Real-time)

- Ngày trong game **tự chạy liên tục**. 1 ngày game = **5 phút thật**, 1 mùa = 7 ngày (\~35 phút), 1 năm = 4 mùa.
- Ví dụ: lúa mì 3 ngày = 15 phút thật; xe bò đi chợ huyện 1 ngày = 5 phút. Mọi hoạt động có **thanh tiến độ**.
- Nút điều khiển: ⏸ Tạm dừng · ▶ ×1 · ⏩ ×2 · ⏩⏩ ×4. Người chơi thoải mái dừng để sắp xếp trang trại.
- **Tính theo timestamp** (không đếm bằng `setInterval`), vì trình duyệt giảm tốc tab đang ẩn.
- **Offline catch-up:** khi mở lại, game tính bù thời gian đã trôi qua, tối đa **8 giờ** thật. Trong lúc vắng mặt, không xảy ra bão, sâu bệnh hay dịch (chỉ tăng trưởng và sản xuất bình thường) để người chơi không bị phạt oan.
- Không có timer chờ để ép chơi hay ép trả tiền, vì game không có monetization.

### I.7 Cấu trúc dữ liệu (ví dụ)

```json
{
  "crop": {
    "id": "wheat", "name": "Lúa mì",
    "seed_price": 10, "grow_days": 3, "yield": 4, "base_price": 6,
    "seasons": ["spring", "summer", "autumn", "winter"],
    "unlock_level": 1, "shelf_life_days": 20, "water_need": 1
  },
  "vehicle": {
    "id": "ox_cart", "capacity": 60, "trip_days": 1, "cost": 10,
    "routes": ["village", "district"], "cold": false
  }
}
```

Tách toàn bộ dữ liệu (cây, vật nuôi, công thức, xe, giá) ra **file cấu hình** (JSON/CSV) để chỉnh cân bằng không cần sửa code.

### I.8 Hướng kỹ thuật cho bản Web

- **Công nghệ gợi ý:** HTML5 + JavaScript/TypeScript. Giao diện tab/menu dùng DOM (HTML/CSS), khu đồng ruộng/chuồng trại vẽ bằng Canvas hoặc thư viện như **Phaser / PixiJS**.
- **Không cần backend:** không đăng nhập, không máy chủ, không bảng xếp hạng.
- **Lưu game:** `IndexedDB` (hoặc `localStorage`), tự lưu mỗi 30 giây và khi đóng tab. Thêm **Xuất/Nhập file save** để chống mất dữ liệu khi xóa cache hay đổi máy.
- **Responsive:** chạy được trên cả laptop và điện thoại (UI nút to, kéo/chạm).
- **Kiến trúc:** tách `Game State` (dữ liệu) – `Systems` (logic cây, vật nuôi, giá, vận tải) – `UI` (hiển thị). Mọi số liệu đọc từ file cấu hình JSON (mục I.7).
- Các hệ thống chạy theo vòng `tick(deltaTime)`; offline catch-up dùng lại chính hàm này với delta lớn.

### I.9 Phong cách Cute (Art & Cảm giác chơi)

- **Hình ảnh:** nhân vật và vật nuôi dạng chibi, mắt to, viền mềm; bảng màu pastel ấm (xanh lá nhạt, kem, vàng bơ, hồng đào); UI dạng gỗ/giấy bo tròn.
- **Mỗi thứ có "mặt":** gà, bò, cừu có biểu cảm vui/đói/buồn thay cho thanh số liệu khô khan. Cây lớn có 3–4 giai đoạn dễ thương.
- **Hoạt ảnh nhỏ cho phản hồi:** cây nảy lên khi thu hoạch, đồng xu bay vào ví khi bán, xe chạy bánh quay lúc vận chuyển.
- **Âm thanh:** nhạc nền nhẹ theo mùa, tiếng "pop" khi bấm, tiếng vật nuôi.
- **Thiết kế cozy, không trừng phạt:** không thua cuộc vĩnh viễn; cây héo vẫn cứu được bằng nước, vật nuôi không chết, phá sản thì được tặng vốn khởi động lại.
- **Nhân vật dẫn chuyện:** 1 NPC (ví dụ bác nông dân hoặc cún) hướng dẫn, nhắc việc và báo tin chợ.

### I.10 Ảnh hưởng của các quyết định đã chốt

| Quyết định | Hệ quả thiết kế |
| --- | --- |
| Web | Lưu local, tối ưu tải nhanh, dùng asset nhẹ (sprite sheet), responsive |
| Real-time | Cần tick theo timestamp, nút tạm dừng/tăng tốc, offline catch-up |
| Single-player offline | Chợ và NPC do hệ thống mô phỏng; không bảng xếp hạng, không trao đổi với bạn |
| Cute | Cozy, ít trừng phạt, nhiều phản hồi hình ảnh/âm thanh |
| Không monetization | Không năng lượng/timer/tiền tệ premium; cân bằng chỉ cần phục vụ độ vui và thử thách |

## Phần II. Tính khả biến: mỗi lần chơi một khác

### II.1 Nguyên tắc chung

1. **Khác có ý nghĩa:** thứ ngẫu nhiên phải làm thay đổi *quyết định* (trồng gì, bán đâu), không chỉ đổi số cho vui.
2. **Seed mỗi save:** khi tạo game mới, sinh 1 `world_seed`. Toàn bộ nội dung ngẫu nhiên suy ra từ seed này, nên save/load luôn cho kết quả giống nhau (không thể load lại để "quay số" sự kiện tốt).
3. **Luôn chơi được:** mọi seed đều phải có đường đi khả thi (xem mục II.8).
4. **Cozy:** ngẫu nhiên tạo thử thách và niềm vui khám phá, không tạo thất bại vĩnh viễn.
5. **Dữ liệu hóa:** mọi pool (loại đất, tính cách chợ, mục tiêu, sự kiện) nằm trong file JSON, thêm nội dung không cần sửa code.

### II.2 Tổng quan 5 lớp

| Lớp | Sinh khi nào | Thay đổi cái gì | Người chơi phải đổi gì |
| --- | --- | --- | --- |
| 1. Đất & bản đồ | Tạo game | Chất lượng/loại đất từng ô | Chọn cây hợp đất |
| 2. Tính cách chợ | Tạo game + đổi chậm theo năm | Món ưa chuộng, kiểu trả giá | Chọn nơi bán, mặt hàng chủ lực |
| 3. Hồ sơ khởi đầu | Tạo game | Vốn, đất, vật phẩm, đặc tính | Cách mở màn |
| 4. Mục tiêu mùa | Đầu mỗi mùa | Yêu cầu của làng/lễ hội | Kế hoạch sản xuất theo mùa |
| 5. Chuỗi sự kiện | Khi điều kiện thỏa | Cơ hội/hệ quả theo hành động | Quan hệ với NPC, rủi ro |

### II.3 Lớp 1: Đất & bản đồ

Mỗi ô đất có **loại đất** và **chất lượng** sinh từ seed.

| Loại đất | Hợp với | Kém với | Đặc điểm |
| --- | --- | --- | --- |
| Phù sa | Lúa, rau | Cây khô | Phì cao, giữ nước tốt |
| Đất cát | Dưa, khoai | Lúa | Thoát nước nhanh, cần tưới nhiều |
| Đất sét | Lúa, ngô | Rau củ | Giữ nước, lớn chậm |
| Đất đồi | Dâu, cây ăn quả | Lúa | Phì thấp nhưng ít sâu bệnh |

- **Hệ số đất:** mỗi cây có bảng hệ số theo loại đất (0.6 – 1.3), nhân vào công thức sản lượng ở mục I.3.1:

```
Sản lượng = Sản_lượng_gốc × Hệ_số_đất(cây, loại_đất) × Hệ_số_phì × ...
```

- **Bố cục:** các ô được sinh theo cụm (vùng phù sa cạnh sông, vùng đồi phía sau...), có thể có **ô đặc biệt** (suối nước, đất giàu khoáng).
- **Cải tạo đất:** bón phân, cày sâu, làm bậc thang có thể nâng loại đất lên một bậc, giúp người chơi có hướng đầu tư dài hạn.

### II.4 Lớp 2: Tính cách chợ

Mỗi chợ có 2 thuộc tính sinh từ seed:

**a) Sở thích (Demand profile):** 2–3 nhóm hàng được trả giá +20–40%, 1–2 nhóm bị trả giá thấp. **b) Tính cách (Trait):** chọn 1 từ pool.

| Tính cách | Hiệu ứng |
| --- | --- |
| Kén chất lượng | Chỉ trả giá cao cho hàng chất lượng ≥ ⭐⭐⭐ |
| Chuộng hàng tươi | Hàng tươi +25%, hàng khô −15% |
| Giá ổn định | Cầu hồi phục nhanh (20%/ngày) nhưng giá không bao giờ vượt trần |
| Chợ đầu mối | Mua số lượng lớn, giá thấp, ít bão hòa |
| Chợ biến động | Giá lên xuống mạnh (±30%), dễ lãi lớn hoặc ế |

- Các chợ **dịch chuyển chậm**: mỗi năm game (4 mùa), 1 chợ có thể đổi sở thích, buộc người chơi theo dõi thay vì thuộc lòng.
- Người chơi **khám phá** sở thích chợ bằng cách bán thử, hỏi NPC thương lái hoặc xem bảng tin chợ (thông tin dần dần được mở ra).

### II.5 Lớp 3: Hồ sơ khởi đầu

Người chơi chọn 1 trong 3 hồ sơ được rút ngẫu nhiên (hoặc chọn thủ công ở chế độ tự do).

| Hồ sơ | Vốn | Đất | Vật phẩm / đặc tính | Phong cách |
| --- | --- | --- | --- | --- |
| Nông dân chăm chỉ | Thấp | 6 ô | Cây trồng lớn nhanh hơn 10% | Trồng trọt thuần |
| Chủ trại | Trung bình | 3 ô + chuồng gà | Vật nuôi nhanh đạt hài lòng | Chăn nuôi sớm |
| Thương nhân | Cao | 2 ô | Xe bò sẵn, bán chợ xa +10% | Buôn bán, vận tải |
| Đầu bếp | Trung bình | 3 ô | Mở sẵn chế biến, thành phẩm +15% | Chế biến sớm |
| Người thừa kế | Rất thấp | 8 ô tệ | Có "kho báu" vài cây giống hiếm | Khởi đầu khó, thưởng lớn |

Mỗi hồ sơ là một **đặc tính cố định đến hết game** (nhỏ, không phá cân bằng), cộng với điều kiện khởi đầu khác.

### II.6 Lớp 4: Mục tiêu mùa

Đầu mỗi mùa, làng đưa ra 1–2 **mục tiêu mùa** từ một pool, có phần thưởng (tiền, XP, vật phẩm trang trí hiếm).

- Ví dụ: *"Làng cần 60 bó lúa mì trước lễ hội thu hoạch"*, *"Lễ hội phô mai: nộp 10 phô mai chất lượng cao"*, *"Mùa hạn: giữ độ ẩm đất trên 40 trong 5 ngày"*.
- **Điều kiện sinh:** chỉ sinh mục tiêu mà người chơi **đã mở khóa đủ hệ thống** để làm được, và có chút tính "ép ra khỏi vùng an toàn" (ví dụ nếu chỉ trồng một loại, hay hỏi một loại khác).
- Có mục tiêu **tùy chọn** (bỏ qua không phạt) và mục tiêu **thử thách** (khó hơn, thưởng lớn hơn).
- Mục tiêu năm: chuỗi 4 mùa tạo thành "chủ đề năm" (Năm của mùa màng, Năm của lễ hội...).

### II.7 Lớp 5: Chuỗi sự kiện có hệ quả

Mô hình mỗi sự kiện: `Điều kiện → Sự kiện → Lựa chọn → Hệ quả (có thể mở sự kiện tiếp)`.

**Ví dụ: Thương lái Bác Tư (độ thân thiết `trust`)**

```
Bán ≥ 50 sản phẩm cho Bác Tư        → trust +1
trust ≥ 3                           → mở sự kiện "Bác Tư giới thiệu chợ huyện"
  ├─ Nhận: mở tuyến chợ huyện sớm, nhưng phải giao đủ 20 hàng/tuần
  └─ Từ chối: không thay đổi, trust giữ nguyên
Giao thiếu hàng 2 tuần liền         → trust −1, Bác Tư tạm mua giá thấp
```

**Các nhóm sự kiện:**

- **Quan hệ NPC:** thương lái, bác sĩ thú y, thợ máy (giảm phí sửa xe nếu thân).
- **Thiên nhiên:** năm hạn, mưa nhiều, dịch sâu. Tác động lên cả vùng đất theo seed.
- **Cơ hội:** thương nhân ghé thăm bán giống hiếm, hội chợ.
- **Hệ quả dài hạn:** chọn trồng độc canh nhiều mùa → đất yếu, sau đó có sự kiện "chuyên gia nông nghiệp ghé thăm" gợi ý luân canh.

Một số sự kiện chỉ xảy ra **một lần mỗi save**, nên mỗi game có "câu chuyện" riêng.

### II.8 Kỹ thuật & bảo đảm cân bằng

**Sinh số ngẫu nhiên có seed:** dùng bộ RNG có seed (ví dụ `mulberry32`), mỗi hệ thống có luồng riêng để thêm tính năng không làm đổi kết quả cũ:

```js
const rng = makeRng(hash(world_seed + ":market"));        // chợ
const dayRng = makeRng(hash(world_seed + ":day:" + day)); // sự kiện theo ngày
```

- Sự kiện mỗi ngày dùng `seed + số_ngày`, nên load lại save ở cùng ngày cho cùng sự kiện (chống "quay số").
- **Offline catch-up:** không sinh sự kiện xấu trong thời gian vắng mặt (đã chốt ở mục I.6).

**Kiểm tra khả thi khi sinh seed (validator):**

- Có ít nhất **2 cây** lãi ≥ 10/ô ở cấp 1 trên đất của người chơi.
- Có ít nhất 1 chợ trả giá cao cho cây khả thi đó.
- Không sinh hai sự kiện tiêu cực liên tiếp trong 3 ngày đầu.
- Nếu validator thất bại → sinh lại với `seed + 1`.

**Cấu trúc dữ liệu mẫu:**

```json
{
  "market_trait": { "id": "picky", "quality_min": 3, "price_bonus": 0.3 },
  "event": {
    "id": "traveler_visit", "once_per_save": true,
    "conditions": { "season": ["autumn"], "min_level": 5 },
    "choices": [
      { "text": "Mua giống hiếm", "effects": [{ "gold": -200 }, { "item": "rare_seed", "qty": 3 }] },
      { "text": "Từ chối", "effects": [] }
    ]
  }
}
```

### II.9 Chế độ chơi (tùy chọn)

- **Chế độ cốt truyện nhẹ:** seed mỗi save, mục tiêu năm có chủ đề.
- **Chế độ tự do (sandbox):** chọn hồ sơ, nhập seed, bật/tắt sự kiện xấu.
- **Seed chia sẻ:** vì không có online, người chơi có thể gửi `world_seed` cho bạn bè để cùng thử một bản đồ (không cần server).

## Phần III. Chướng ngại & Rủi ro

### III.1 Nguyên tắc thiết kế

1. **Báo trước, có cách đối phó:** gần như mọi chướng ngại có dấu hiệu cảnh báo và ít nhất một cách phòng/chữa. Thua vì không chuẩn bị chứ không phải vì xui.
2. **Tổn thất có trần:** một sự kiện chỉ lấy tối đa \~30% loại tài sản bị ảnh hưởng. Không có phá sản vĩnh viễn (hết tiền thì làng hỗ trợ vốn nhỏ).
3. **Phi bạo lực, tông dễ thương:** trộm là cáo/quạ/chuột hay "kẻ đeo mặt nạ", xã hội đen là *"Băng Mèo Chợ Đen"* mặc vest đeo kính râm. Hậu quả là mất tiền/hàng/bị chặn đường, không có đánh nhau.
4. **Rủi ro tỉ lệ với sự thành công:** càng giàu càng bị nhắm tới (thuế, xã hội đen), giữ cân bằng cho giai đoạn cuối.
5. **Có thể chỉnh độ khó:** Thư giãn / Chuẩn / Thử thách, và bật/tắt từng nhóm trong chế độ tự do.

### III.2 Danh mục chướng ngại

| Nhóm | Chướng ngại | Tác động chính | Báo trước | Đối phó |
| --- | --- | --- | --- | --- |
| 🌦️ Thiên nhiên | Hạn hán | Đất mất ẩm nhanh, cây chậm lớn | Dự báo 1–2 ngày | Hệ thống tưới, giếng, bể chứa, phủ rơm, cây chịu hạn |
|  | Bão / Lũ | Hỏng cây ở ô thấp, chặn đường xe | Dự báo 1 ngày | Nhà lưới, đê, thu hoạch sớm |
|  | Sương giá / Nóng gắt | Cây trái mùa chết yếu, vật nuôi giảm hài lòng | Dự báo | Nhà kính, quạt/máy sưởi chuồng |
|  | Châu chấu | Ăn mất cây trên diện rộng | Dấu hiệu ở rìa ruộng | Thuốc, bẫy, chim ưng giữ ruộng |
| 🦠 Dịch bệnh | Dịch vật nuôi (cúm gà, bò ốm) | Giảm sản phẩm, lây giữa chuồng | Con vật ho/ủ rũ | Vắc-xin, vệ sinh, chuồng cách ly, thú y |
|  | Bệnh cây lan | Giảm sản lượng cả cụm | Lá đổi màu | Thuốc, luân canh, nhổ bỏ ô bệnh |
| 🦊 An ninh | Trộm vặt | Mất 5–10% hàng trong kho/chuồng | Dấu chân, ổ khóa hỏng | Hàng rào, chó giữ nhà, khóa kho, đèn |
|  | Cướp đường | Mất tới 30% lô hàng đang chở | Cảnh báo tuyến nguy hiểm | Hộ tống, đi đoàn, đổi tuyến, bảo hiểm hàng |
|  | Xã hội đen | Đòi phí bảo kê, quấy phá chợ | Thư/NPC báo trước | Xem mục III.4 |
| 💰 Kinh tế | Thuế | Trừ tiền định kỳ | Thư báo, hạn nộp | Xem mục III.5 |
|  | Giá sụp / khủng hoảng | Giá 1 nhóm hàng −30% vài ngày | Tin chợ | Tích trữ kho lạnh, chuyển chợ, chế biến |
|  | Thanh tra chất lượng | Phạt nếu bán hàng chất lượng thấp | Thư báo | Giữ chất lượng ≥ ngưỡng |
| 🔧 Sự cố | Hỏng xe/máy, cháy kho | Dừng hoạt động, mất hàng | Độ bền giảm | Bảo dưỡng, kho phòng cháy, thợ máy NPC |

### III.3 Cơ chế chung

**Xác suất xảy ra mỗi ngày:**

```
P = P_gốc × Hệ_số_seed × Hệ_số_giàu_có × (1 − Mức_phòng_vệ)
```

- `Hệ_số_seed`: đất ven sông dễ lũ, đất đồi dễ hạn, tuyến xa nhiều cướp (liên kết lớp Đất và Chợ ở Phần II).
- `Mức_phòng_vệ`: tổng các công trình phòng thủ đã xây (0 → tối đa 0.8). Không bao giờ về 0 rủi ro.

**Quy tắc an toàn:**

- 3 ngày đầu và 1 mùa đầu: chỉ có thiên tai nhẹ.
- Tối đa **1 sự kiện lớn mỗi 3 ngày**; sau sự kiện lớn có "thời gian bình yên".
- Mỗi chướng ngại có **level mở khóa** (thuế từ level 5, xã hội đen từ level 12...).
- Vừa mất quá nhiều (>50% tiền trong 1 mùa) → làng tặng gói hỗ trợ ("pity").

**Bảo hiểm Hợp tác xã (tab Làng):** trả phí mỗi mùa, bồi thường 50–70% thiệt hại do thiên tai, dịch bệnh, cướp, cháy. **Không** bảo hiểm thuế và xã hội đen.

### III.4 Xã hội đen: Băng Mèo Chợ Đen

- **Xuất hiện khi:** tổng tài sản vượt ngưỡng hoặc người chơi bán ở chợ lớn.
- **Chuỗi sự kiện:**

```
Mèo Đen ghé thăm: "Bảo kê" 8% doanh thu chợ mỗi tuần
├─ Trả          → an toàn trước trộm/cướp từ băng, thêm phí cố định
├─ Thương lượng → cần quan hệ NPC (trust), giảm còn 4%
├─ Từ chối      → quấy phá: giá chợ −10%, trộm tăng trong 1 mùa
└─ Báo chính quyền → cần độ uy tín cao với làng, nếu thành công băng rút lui;
                    thất bại thì họ "trả đũa" nhẹ
```

- Có thể **đóng cửa chợ/tuyến** do băng chiếm, người chơi phải đi chợ khác.
- Hai chỉ số: `quan hệ với băng` và `uy tín với chính quyền`, tạo ra hướng chơi "giữ hòa khí" hay "cứng rắn".

### III.5 Thuế

| Loại thuế | Mốc nộp | Công thức mẫu | Ghi chú |
| --- | --- | --- | --- |
| Thuế đất | Cuối mùa | `Số_ô × Mức_thuế(level)` | Miễn cho ô mới trong 1 mùa |
| Phí/thuế bán hàng | Khi bán | 3–5% giá trị bán | Gộp với phí chợ, giảm nhờ quan hệ |
| Thuế thu nhập | Cuối năm | 5–15% phần doanh thu vượt ngưỡng (lũy tiến) | Có thể giảm nhờ khấu trừ đầu tư |
| Phí nhập khẩu | Khi mua giống hiếm | 10% | Chỉ khi mua từ thương nhân xa |

- **Nộp trễ:** phạt lãi nhẹ rồi cho trả góp, không tịch thu tài sản.
- **Ưu đãi:** làm xong mục tiêu mùa của làng được giảm thuế đất, mở chuỗi "Hợp tác xã" giảm thuế cho sản phẩm địa phương.
- Thuế là **money sink** chính ở giai đoạn cuối, nên chặn người chơi tích tiền vô hạn.

### III.6 Công trình & công cụ phòng vệ

| Công trình | Chống | Hiệu quả (mẫu) |
| --- | --- | --- |
| Hàng rào, chó giữ nhà | Trộm vặt, thú hoang | −40% xác suất, chó phát hiện thêm |
| Khóa kho, đèn/camera | Trộm kho | −50% mất hàng |
| Giếng, bể chứa, hệ thống tưới | Hạn hán | Giảm tiêu hao nước 50% |
| Nhà lưới/nhà kính | Bão, sương giá, châu chấu | Bảo vệ 1 cụm ô |
| Đê/cống thoát nước | Lũ | Bảo vệ các ô thấp |
| Chuồng cách ly + vắc-xin | Dịch vật nuôi | Chặn lây, giảm thời gian ốm |
| Kho phòng cháy | Cháy | −70% thiệt hại |
| Đội hộ tống | Cướp đường | −60% xác suất, tốn phí/chuyến |

Phòng vệ cũng có **chi phí duy trì** (cho chó ăn, trả tiền hộ tống) để người chơi phải cân nhắc đầu tư.

### III.7 Tích hợp với real-time và UI

- **Cảnh báo dạng toast** ("🌩️ Bão đến sau 1 ngày!"). Sự kiện lớn **tự động tạm dừng** game để người chơi kịp phản ứng (có thể tắt).
- **Offline catch-up:** không phát sinh chướng ngại trong thời gian vắng mặt; hạn nộp thuế được lùi tương ứng.
- **Tab Làng:** bảng tin & dự báo thời tiết, thư thuế, bảo hiểm HTX, quan hệ NPC (thương lái, thú y, Băng Mèo, chính quyền).
- **Tất cả sinh theo seed + số ngày**, nên load lại save không đổi sự kiện.

### III.8 Cấu trúc dữ liệu mẫu

```json
{
  "id": "drought",
  "category": "nature",
  "unlock_level": 3,
  "base_chance_per_day": 0.04,
  "duration_days": [2, 3],
  "warning_days": 1,
  "effects": [{ "target": "plot.moisture", "mult": 0.5 }],
  "counters": ["irrigation", "well", "drought_resistant_crop"],
  "loss_cap": 0.3
}
```

## Phần IV. Câu cá & Ao cá

### IV.1 Vai trò & nguyên tắc

- **Lấp khoảng trống:** mùa đông cây trồng ít, câu cá cho người chơi việc để làm và nguồn thu mới.
- **Tận dụng hệ thống sẵn:** cá là "nhóm hàng" mới đi theo chuỗi *Kho → Chế biến → Vận tải → Chợ*, ao cá hoạt động như chuồng trại.
- **Nhịp thư giãn:** minigame ngắn (20–30 giây/lượt), dễ chơi bằng chuột hoặc chạm, không có "thể lực" hay giới hạn lượt vì game không có monetization.
- **Thủ công trước, tự động sau:** câu tay là chính, bẫy cá/cần câu tự động là phần thưởng nâng cấp.

### IV.2 Vùng nước

Sinh từ `world_seed` (liên kết lớp Đất & bản đồ): mỗi save có vị trí và loại nước khác nhau.

| Vùng nước | Cá đặc trưng | Đặc điểm | Mở khóa |
| --- | --- | --- | --- |
| Ao nhà | Cá nuôi (rô phi, chép) | Nuôi được, kiểm soát hoàn toàn | Level 9 |
| Sông | Chép, trê, lóc | Cá đa dạng, bị ảnh hưởng lũ/hạn | Level 4 |
| Suối đồi | Cá hồi suối, cá chình | Cá hiếm, nước lạnh, ít cá | Level 8 |
| Hồ lớn | Koi, cá vàng, cá lớn | Cần thuyền, cá giá cao | Level 14 |

Mỗi vùng có `độ sạch nước (0–100)` ảnh hưởng tỉ lệ cá cắn, chất lượng cá và bệnh.

### IV.3 Câu cá (minigame)

**Luồng chơi:**

```
Chọn vùng → Chọn cần + mồi → Quăng (giữ & thả chuột/chạm)
→ Chờ cá cắn (3–10 giây, có phao rung) → Minigame kéo cá → Kết quả
```

**Minigame kéo cá:** có thanh dọc, một **vùng xanh** (cần câu) người chơi điều khiển bằng giữ chuột/chạm để đuổi theo **icon cá** đang di chuyển.

- Giữ icon cá trong vùng xanh đủ lâu → lên cá; để tuột thanh → cá chạy.
- Cá hiếm di chuyển nhanh, thất thường hơn; cá khỏe làm vùng xanh nhỏ lại.
- **Chất lượng ⭐1–3** dựa trên độ chính xác khi kéo.
- Có chế độ **"Câu nhàn"** (bật khi có cần câu tự động): không cần minigame nhưng cá chất lượng ⭐1 và tỉ lệ thấp.

**Yếu tố ảnh hưởng tỉ lệ cắn:**

| Yếu tố | Tác động |
| --- | --- |
| Mùa | Mỗi loài có mùa vụ, ngoài mùa thấp hơn |
| Buổi trong ngày (Sáng / Trưa / Chiều / Tối) | Bình minh và hoàng hôn cá cắn mạnh; 1 ngày game = 5 phút nên mỗi buổi \~75 giây |
| Thời tiết | Mưa nhẹ tăng cắn, bão/nóng gắt giảm mạnh |
| Mồi | Mồi đúng sở thích loài tăng tỉ lệ & cho cá hiếm |
| Cần câu | Quyết định vùng xanh, độ bền dây, cá lớn nhất kéo được |
| Độ sạch nước | Nước đục: ít cá, chất lượng thấp |

**Công thức tỉ lệ cắn mẫu:**

```
P_cắn = Cơ_sở × H_mùa × H_buổi × H_thời_tiết × H_mồi × (Độ_sạch / 100)
```

### IV.4 Dụng cụ

| Dụng cụ | Công dụng | Mốc |
| --- | --- | --- |
| Cần tre | Cá nhỏ, vùng xanh nhỏ | Tặng khi bắt đầu |
| Cần sợi / carbon | Vùng xanh lớn, kéo cá lớn | Level 6 / 12 |
| Mồi giun, bánh mì, tôm nhỏ, mồi đặc biệt | Thu hút từng nhóm cá | Mua ở Cửa hàng |
| **Bẫy cá / lưới** | Thụ động: đặt, vài ngày sau thu, ít cá | Level 7 |
| **Cần câu tự động** | Câu nhàn không cần chơi | Level 11 |
| **Thuyền** | Mở hồ lớn, cá giá cao | Level 14 |

### IV.5 Bảng cá mẫu

| Cá | Vùng | Mùa | Buổi | Độ hiếm | Giá bán (⭐1) | Level |
| --- | --- | --- | --- | --- | --- | --- |
| Cá rô phi | Ao/Sông | Hạ, Thu | Cả ngày | Thường | 10 | 4 |
| Cá chép | Ao/Sông | Xuân, Thu | Sáng, Chiều | Thường | 14 | 4 |
| Cá trê | Sông | Hạ | Tối | Thường | 12 | 5 |
| Cá lóc | Sông | Thu | Sáng | Ít gặp | 22 | 7 |
| Cá hồi suối | Suối | Đông | Sáng | Hiếm | 35 | 8 |
| Cá chình | Suối/Hồ | Thu | Tối | Hiếm | 80 | 10 |
| Cá vàng | Hồ | Xuân | Sáng | Rất hiếm | 100 | 14 |
| Cá koi | Hồ | Mọi mùa | Chiều | Rất hiếm | 150 | 14 |

- Giá nhân theo chất lượng: ⭐1 ×1, ⭐2 ×1.3, ⭐3 ×1.7.
- Mỗi cá có **kích thước ngẫu nhiên**, kích thước càng gần kỷ lục càng được tính điểm sổ cá.

### IV.6 Ao cá (nuôi cá)

Hoạt động như chuồng trại: thả cá giống, cho ăn, chờ lớn, thu hoạch.

| Cá giống | Giá giống | Chu kỳ | Sản lượng | Giá bán | Sức chứa ao nhỏ |
| --- | --- | --- | --- | --- | --- |
| Rô phi | 5/con | 7 ngày | 1 con/giống | 10 | 20 |
| Chép | 8/con | 8 ngày | 1 con/giống | 14 | 16 |
| Cá lóc | 15/con | 10 ngày | 1 con/giống | 22 | 10 |

- **Cho ăn:** thức ăn mua ở cửa hàng hoặc làm từ phụ phẩm (cám lúa, sâu). Bỏ đói thì cá chậm lớn, không chết (cozy).
- **Độ sạch nước:** giảm theo mật độ cá và thức ăn dư; tăng nhờ thay nước, cây thủy sinh, máy sục khí.

```
Δ Độ_sạch/ngày = −0.5 × (Số_cá / Sức_chứa) − Thức_ăn_dư + Xử_lý_nước
```

- **Bệnh cá:** khi độ sạch \< 40 dễ bệnh, giảm tăng trưởng; chữa bằng thuốc/thay nước (khớp nhóm *Dịch bệnh*).
- **Nâng cấp:** mở rộng ao (+sức chứa), máy sục khí, ao thứ hai.
- **Kết hợp lúa–cá:** đặt ao cạnh ruộng lúa: giảm lượng nước tưới \~20%, cá cho phân tự nhiên (+độ phì). Khuyến khích người chơi bố trí khéo.

### IV.7 Chế biến, kho, vận tải, chợ

- **Chế biến:** cá khô (3 ngày, hạn dài), cá hun khói, chả cá, súp cá (kết hợp rau củ), cá muối. Thành phẩm giá gấp 1.5–3 lần.
- **Kho:** cá tươi **hạn sử dụng ngắn (1–2 ngày)**, phải bán/chế biến sớm hoặc để kho lạnh. Khớp cơ chế hàng tươi sẵn có.
- **Vận tải:** cá tươi cần **xe lạnh** khi đi chợ xa, nếu không bị giảm chất lượng.
- **Chợ:** cá thuộc nhóm "hàng tươi". Chợ có tính cách *Chuộng hàng tươi* trả cá cao, chợ kén chất lượng chỉ lấy cá ⭐2 trở lên. Đơn hàng có thể yêu cầu "10 cá chép ⭐2".

### IV.8 Sổ cá & sự kiện

- **Sổ cá (album):** ghi mỗi loài đã bắt, kích thước lớn nhất, số lượng. Đạt mốc (5, 10, 20 loài) được thưởng vật phẩm trang trí, cần câu đẹp, mồi hiếm.
- **Lễ hội câu cá (sự kiện mùa):** thi bắt cá lớn nhất trong 1 ngày, phần thưởng cho người đứng đầu *so với kỷ lục NPC* (không cần online).
- **Cá huyền thoại:** mỗi save có 1 loài sinh theo seed, xuất hiện rất hiếm ở 1 vùng nước, gợi ý bằng tin đồn của NPC.
- **Mục tiêu mùa:** làng có thể yêu cầu "nộp 15 cá cho lễ hội mùa thu".

### IV.9 Chướng ngại liên quan

| Chướng ngại | Tác động tới cá |
| --- | --- |
| Hạn hán | Ao/sông cạn, độ sạch giảm, cá bắt khó hơn |
| Bão / Lũ | Cá tràn ra khỏi ao, vùng sông đục |
| Ô nhiễm nước | Giảm độ sạch toàn vùng, cần xử lý |
| Cá bệnh | Giảm tăng trưởng, lan trong ao |
| Trộm | Mất cá trong ao ban đêm (phòng bằng rào, chó, đèn) |
| Thuế / giấy phép | Phí giấy phép câu ở sông công cộng, mùa cấm câu (cá sinh sản) có thể tắt trong chế độ Thư giãn |

### IV.10 Dữ liệu mẫu

```json
{
  "fish": {
    "id": "carp", "name": "Cá chép", "category": "fresh_fish",
    "waters": ["pond", "river"], "seasons": ["spring", "autumn"],
    "time_of_day": ["morning", "evening"], "rarity": "common",
    "base_price": 14, "shelf_life_days": 2, "min_level": 4,
    "bait": ["worm", "bread"], "size_range_cm": [20, 60],
    "minigame": { "speed": 1.0, "erratic": 0.2 }
  },
  "water_zone": { "type": "river", "cleanliness": 80, "fish_pool": ["carp", "catfish", "snakehead"] }
}
```

### IV.11 Chuẩn bị chỗ cắm (làm từ MVP, không cần code tính năng)

- Vật phẩm có trường `category` (thêm `fresh_fish` là xong).
- "Ô đất" đổi tên khái niệm thành **"Vùng"** (đất hoặc nước), seed sinh luôn sông/ao/hồ.
- Chợ và kho đã hỗ trợ hàng tươi, hạn sử dụng.
- Tab **Đất & Nước** (tên mới của Đồng ruộng) chứa trồng trọt, ao cá và câu cá.

## Phần V. Lộ trình tổng hợp & việc cần làm tiếp

### V.1 Lộ trình

| Giai đoạn | Nội dung |
| --- | --- |
| **MVP** | Đất & Nước (chỉ trồng trọt), Cửa hàng, Kho, Chợ làng; 4 loại cây, 1 mùa; ngày real-time + lưu local. RNG có seed, loại đất, 2–3 hồ sơ khởi đầu. Chuẩn bị chỗ cắm: `category` cho vật phẩm, khái niệm "Vùng" (đất/nước) |
| **Phase 2** | Chuồng trại, Chế biến, Vận tải, giá cung cầu, 4 mùa. Tính cách chợ + validator seed. Thiên tai (hạn, bão), dịch vật nuôi, cảnh báo & tự tạm dừng |
| **Phase 3** | Đơn hàng, thương lái, nhân công, nhiệm vụ, thành tựu. Mục tiêu mùa, sự kiện cơ bản. Trộm, cướp đường, thuế, bảo hiểm HTX, **tab Làng**. **Ao cá** |
| **Phase 4** | Chợ thành phố, cây hiếm, trang trí, thú cưng. Chuỗi sự kiện NPC, seed chia sẻ. Xã hội đen, thanh tra, giá sụp, 3 mức độ khó. **Minigame câu cá**, sổ cá, lễ hội, thuyền & hồ lớn, cá huyền thoại |

### V.2 Việc cần làm tiếp

1. Chốt engine (Phaser hay DOM thuần) và art style cụ thể (pixel cute hay vẽ tay).
2. Làm prototype MVP: 4 ô đất, cửa hàng hạt giống, kho, chợ làng, vòng ngày real-time.
3. Lập **bảng cân bằng số liệu toàn game** (xác suất sự kiện, giá, chi phí phòng vệ, thuế theo level) rồi chơi thử để chỉnh.