# 🌾 Game Nông Trại: Tài liệu thiết kế hệ thống hoàn chỉnh (Bản 2: Chân thực & Nhịp độ nhanh)

> **Đã chốt:** Nền tảng **Web** · **Real-time** (ngày tự chạy, có tua thông minh) · **Single-player, không online** · **Không có monetization**.
> **Định hướng mới của bản 2:** mô phỏng **chân thực** (chi phí, giá cả, rủi ro, tài chính có thật), **không có hệ thống thưởng kiểu game** (XP/level, quà nhiệm vụ, quà hỗ trợ, thành tựu có thưởng), **không có xã hội đen**.
> **Giả định cần xác nhận:** (1) chế độ **"Thực tế"** là mặc định, vẫn có "Dễ thở" và "Khắc nghiệt" (mục III.9). (2) Hướng hình ảnh giữ ấm áp, dễ đọc; chưa chốt có giữ phong cách chibi hay chuyển sang bán thực tế (mục I.9).
> Mọi con số là **số mẫu** để cân bằng lại sau.

## Những thay đổi so với bản 1

| Hạng mục | Bản 1 | Bản 2 |
| --- | --- | --- |
| Xã hội đen (Băng Mèo Chợ Đen), cướp đường kiểu "kẻ đeo mặt nạ" | Có | **Bỏ.** Thay bằng áp lực thị trường (thương lái ép giá, giá sụp, giá đầu vào tăng) và sự cố vận chuyển (III.2, III.4) |
| XP / Level, mở khóa theo level | Có | **Bỏ.** Mở khóa bằng vốn, đất, thiết bị và uy tín (I.5) |
| Thưởng nhiệm vụ, mục tiêu mùa có thưởng, thành tựu, quà lễ hội, quà sổ cá | Có | **Bỏ.** Thay bằng hợp đồng trả tiền thật có phạt (IV.3), sổ sách và mục tiêu tự đặt (IV.6) |
| Gói hỗ trợ "pity", tặng vốn khi phá sản | Có | **Bỏ.** Thay bằng vay vốn, bảo hiểm, làm thuê (III.7, IV.5) |
| Vật nuôi không chết, cây héo luôn cứu được, offline không có thiên tai | Có | Tùy độ khó (III.9) |
| Nhịp độ: 1 ngày 5 phút, chờ dài, ít việc | Có | **Tua thông minh, giờ công, nhịp buổi trong ngày, thao tác hàng loạt** (I.6) |
| Thị trường | Cung cầu cục bộ | **Thị trường mô phỏng theo vùng**, thương lái, hợp đồng bao tiêu (Phần IV) |
| Tài chính | Chỉ có tiền | **Vay vốn, mua chịu, khấu hao, sổ lãi/lỗ** (Phần IV) |
| Tab Tiến trình | Nhiệm vụ, thành tựu, XP | **Tab Sổ sách & Tài chính** |
| Cây trồng / vật nuôi | Lúa mì, dâu tây, cừu... | **Việt hóa:** rau cải, khoai lang, cà chua, ngô, lúa nước, dâu tây; gà, vịt, bò, heo |
| Thuế | Có, kèm giảm thuế như phần thưởng | **Giữ** (là chi phí thật), bỏ phần giảm thuế kiểu quà tặng |

## Mục lục

- **Phần I. Thiết kế cốt lõi**
  - I.1 Vòng lặp cốt lõi (Core Loop)
  - I.2 Cấu trúc các Tab
  - I.3 Chi tiết từng hệ thống
  - I.4 Kinh tế & cân bằng
  - I.5 Tiến trình & mở khóa (không còn level)
  - I.6 Thời gian, giờ công & nhịp độ
  - I.7 Cấu trúc dữ liệu (ví dụ)
  - I.8 Hướng kỹ thuật cho bản Web
  - I.9 Phong cách hình ảnh & cảm giác chơi
  - I.10 Ảnh hưởng của các quyết định đã chốt
- **Phần II. Tính khả biến: mỗi lần chơi một khác**
  - II.1 Nguyên tắc chung
  - II.2 Tổng quan 5 lớp
  - II.3 Lớp 1: Đất & bản đồ
  - II.4 Lớp 2: Tính cách chợ
  - II.5 Lớp 3: Hồ sơ khởi đầu
  - II.6 Lớp 4: Đề nghị & hợp đồng đầu mùa
  - II.7 Lớp 5: Chuỗi sự kiện có hệ quả
  - II.8 Kỹ thuật & bảo đảm cân bằng
  - II.9 Chế độ chơi
- **Phần III. Chướng ngại & Rủi ro**
  - III.1 Nguyên tắc thiết kế
  - III.2 Danh mục chướng ngại
  - III.3 Cơ chế chung
  - III.4 Áp lực thị trường (thay cho xã hội đen)
  - III.5 Thuế & phí
  - III.6 Công trình & công cụ phòng vệ
  - III.7 Khủng hoảng tài chính & lưới an toàn
  - III.8 Tích hợp với real-time và UI
  - III.9 Ba mức độ khó
  - III.10 Cấu trúc dữ liệu mẫu
- **Phần IV. Tài chính & Thị trường mô phỏng**
  - IV.1 Vai trò & nguyên tắc
  - IV.2 Mô hình giá
  - IV.3 Kênh bán: chợ, thương lái, hợp đồng, đơn lẻ
  - IV.4 Uy tín
  - IV.5 Vay vốn & mua chịu
  - IV.6 Chi phí, khấu hao & sổ sách
  - IV.7 Giá đầu vào
  - IV.8 Dữ liệu mẫu
- **Phần V. Câu cá & Ao cá**
  - V.1 Vai trò & nguyên tắc
  - V.2 Vùng nước
  - V.3 Câu cá (minigame)
  - V.4 Dụng cụ
  - V.5 Bảng cá mẫu
  - V.6 Ao cá (nuôi cá)
  - V.7 Chế biến, kho, vận tải, chợ
  - V.8 Sổ cá & sự kiện
  - V.9 Chướng ngại liên quan
  - V.10 Dữ liệu mẫu
  - V.11 Chuẩn bị chỗ cắm
- **Phần VI. Lộ trình tổng hợp & việc cần làm tiếp**
  - VI.1 Lộ trình
  - VI.2 Chỉ số kiểm nghiệm nhịp độ
  - VI.3 Việc cần làm tiếp

## Phần I. Thiết kế cốt lõi

### I.1 Vòng lặp cốt lõi (Core Loop)

```
Xem dự báo, giá, hợp đồng → Mua giống/vật tư → Gieo trồng & chăn nuôi
→ Chăm sóc (tốn giờ công) → Thu hoạch → Cất kho → (Chế biến) → Vận chuyển
→ Bán (chợ / thương lái / hợp đồng) → Trả chi phí, nợ, thuế → Tái đầu tư
```

Ba vòng lặp lồng nhau, mỗi vòng có việc để làm:

| Vòng | Độ dài | Người chơi làm gì |
| --- | --- | --- |
| **Trong ngày** | ~5 phút (4 buổi) | Xem dự báo & giá → xếp giờ công → chăm sóc → thu hoạch kịp phiên chợ |
| **Theo vụ** | vài ngày đến 1 mùa | Chọn cây theo thời tiết/giá, ký hợp đồng, đầu tư công cụ, quản lý kho |
| **Theo năm** | 28 ngày game | Đối chiếu sổ sách, nộp thuế, trả nợ, mở rộng hay đa dạng hóa |

Điểm hấp dẫn nằm ở **các quyết định có đánh đổi thật**: giờ công dùng vào đâu, trồng gì hợp thời tiết và giá, bán ngay hay chờ giá hay ký hợp đồng, vay để mở rộng hay giữ an toàn.

### I.2 Cấu trúc các Tab

| Tab | Mục đích | Chức năng chính | Liên kết với |
| --- | --- | --- | --- |
| **Đất & Nước** | Trồng trọt, ao cá, câu cá | Cày, gieo, tưới, bón, làm cỏ, thu hoạch, nuôi/câu cá | Cửa hàng (đầu vào), Kho (đầu ra) |
| **Chuồng trại** | Chăn nuôi | Cho ăn, vệ sinh, thu sản phẩm, chữa bệnh | Cửa hàng, Kho |
| **Kho** | Lưu trữ | Tồn kho, sức chứa, hạn sử dụng, hao hụt | Mọi tab |
| **Chế biến** | Tăng giá trị | Xay xát, muối dưa, làm tương, phô mai... | Kho, Chợ |
| **Cửa hàng** | Mua đầu vào | Giống, phân, thuốc, thức ăn, con giống, công cụ, mua chịu | Đất & Nước, Chuồng trại |
| **Vận tải** | Đưa hàng đi bán | Xếp lịch xe, chọn tuyến, thuê xe ngoài, theo dõi chuyến | Kho, Chợ |
| **Chợ** | Bán hàng | Xem giá & biểu đồ, bán, thương lái, hợp đồng | Vận tải |
| **Làng** | Thông tin & quan hệ | Bảng tin, dự báo, thư từ, thuế, bảo hiểm, uy tín NPC | Chợ, Sổ sách |
| **Sổ sách & Tài chính** | Quản lý dài hạn | Lãi/lỗ, nợ, hợp đồng đang chạy, mục tiêu tự đặt, thống kê | Tất cả |

Thanh trên cùng luôn hiển thị: 💰 Tiền · ⏳ Giờ công còn lại · 📅 Ngày/Mùa · 🕒 Buổi · ☁️ Thời tiết kèm dự báo ngắn. **Không còn hiển thị Level/XP.**

### I.3 Chi tiết từng hệ thống

#### I.3.1 Đất & Nước (trồng trọt)

> Tab này gồm trồng trọt, ao cá và câu cá (Phần V). Loại đất xem Phần II, thiên tai xem Phần III.

- Đất chia thành **ô (plot)**, về mặt dữ liệu gọi chung là **"Vùng"** (đất hoặc nước). Mỗi ô có: `loại đất`, `độ phì (0–100)`, `độ ẩm (0–100)`, `sâu bệnh tồn dư (0–100)`, `cây đang trồng`.
- **Trạng thái ô:** Trống → Đã cày → Đã gieo → Đang lớn (3 giai đoạn: nảy mầm, sinh trưởng, chín) → Chín → (Quá hạn trên đồng: hao dần rồi hỏng).
- **Nhu cầu theo giai đoạn:** mỗi cây có nhu cầu nước riêng ở từng giai đoạn (ví dụ lúa cần ngập nước ở giai đoạn đầu, rau sợ úng).
- **Tiến độ lớn theo tích nhiệt:** mỗi ngày cây lớn thêm `Hệ_số_nhiệt × Hệ_số_nước`. Thời gian ghi trên thẻ cây là **dự kiến** ở điều kiện chuẩn; nóng/lạnh lệch khỏi ngưỡng của cây làm kéo dài hoặc rút ngắn. Trồng sai vụ không còn là một hệ số cứng mà là hệ quả của thời tiết.
- **Đầu vào:** hạt giống (bắt buộc), nước (tưới tay, bơm, hệ thống tưới), phân bón (tùy chọn), thuốc (khi có sâu bệnh), **giờ công**.
- **Tác động:**
  - Phân bón: +% sản lượng hoặc −% thời gian lớn; tăng độ phì.
  - Trồng liên tục 1 loại: độ phì giảm, `sâu bệnh tồn dư` tăng → cần **luân canh** hoặc bón phân/xử lý đất.
  - Thời tiết: mưa tự tưới, nắng hạn làm đất bay hơi nhanh, bão có thể phá cây (phòng bằng nhà lưới, đê).
  - Sâu bệnh xuất hiện theo xác suất; bỏ mặc mất 30–50% sản lượng và lan sang ô kề.
  - Cỏ dại: không làm cỏ sau mỗi giai đoạn thì mất thêm tới 15% sản lượng.
- **Chất lượng ⭐1–3:** phụ thuộc giống, tưới đúng lúc, độ phì, mức sâu bệnh; sau đó giảm dần theo độ tươi khi để kho.
- **Mở rộng đất:**
  - **Thuê ô:** 40 đồng/mùa/ô, hết hạn thì trả lại (có thể gia hạn). Vốn thấp, linh hoạt.
  - **Mua ô:** 200 + 15 × (số ô đang sở hữu − 4) đồng. Là tài sản, dùng thế chấp vay ngân hàng (IV.5), phải nộp thuế đất.

**Công thức sản lượng:**

```
Sản lượng = Sản_lượng_gốc × Hệ_số_đất(cây, loại_đất) × Hệ_số_phì × Hệ_số_nước
            × Hệ_số_nhiệt × (1 − Sâu_bệnh − Cỏ_dại) × (1 + Bonus_phân)
```

#### I.3.2 Chuồng trại

> Dịch bệnh và phòng vệ xem Phần III; ao cá hoạt động tương tự chuồng trại (Phần V).

- Mỗi loại chuồng có **sức chứa**, phải xây (tốn tiền và 1 ô đất).
- Vật nuôi có `đói`, `khát`, `sức khỏe`, `hài lòng`, `tuổi`. Hài lòng cao → sản phẩm chất lượng cao hơn.
- **Vòng đời:** vật nuôi có tuổi; năng suất giảm dần khi quá tuổi hiệu quả, đến lúc phải bán thịt và thay đàn.
- **Chăm sóc hằng ngày tốn giờ công:** cho ăn/uống, thu sản phẩm, vệ sinh chuồng. Bỏ vệ sinh làm tăng xác suất bệnh.
- **Hậu quả bỏ đói** (mức "Thực tế"): quá 2 ngày giảm sản lượng; quá 4 ngày ốm; quá 6 ngày không chữa có thể chết. Mức "Dễ thở" thì vật nuôi không chết.
- **Thức ăn là khoản chi lớn nhất** (thường chiếm 40–60% doanh thu từ vật nuôi), nên chăn nuôi là bài toán lãi mỏng cần tối ưu.
- Dịch bệnh ngẫu nhiên, cần thú y, vắc-xin, cách ly và vệ sinh.

| Vật nuôi | Giá mua | Thức ăn/ngày | Sản phẩm | Giá bán SP | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| Gà | 60 | 1 đơn vị (3đ) | 1 trứng/ngày | 9 | Đẻ tốt ~28 ngày, sau đó bán thịt (45) |
| Vịt | 70 | 1 đơn vị (3đ) + nước | 1 trứng/ngày | 10 | Hợp khi có ao/ruộng nước gần, bớt thức ăn |
| Bò sữa | 500 | 2 đơn vị (6đ) + nước | 2 sữa/ngày | 14 | Cần chuồng riêng, thú y định kỳ, bán thịt 300 |
| Heo thịt | 120 (heo con) | 2 đơn vị (6đ) | Bán thịt sau 14 ngày | ~260/con | Lãi theo chu kỳ, rủi ro dịch nặng nhất |

#### I.3.3 Kho

- Có **sức chứa tối đa** (nâng cấp bằng tiền). Đầy kho thì thu hoạch không cất được, buộc bán hoặc bỏ.
- Hàng tươi (rau, sữa, trứng, cá) có **hạn sử dụng**; chất lượng và giá giảm dần theo ngày rồi hỏng. Hàng khô (lúa, ngô, khoai) bền hơn nhưng vẫn **hao hụt** nhẹ do ẩm, mọt, chuột nếu kho không kín.
- **Kho lạnh** kéo dài hạn hàng tươi, tốn tiền điện mỗi ngày và có rủi ro mất điện.
- **Giá trị tồn kho** hiển thị theo giá thị trường hiện tại, nhưng chỉ là giá trị trên giấy cho đến khi bán được.
- Kho là "van điều áp" của game: bán ngay hay tích trữ chờ giá đều có giá phải trả.

#### I.3.4 Cửa hàng (mua đầu vào)

- Danh mục: **Hạt giống · Phân bón · Thuốc BVTV · Thức ăn · Con giống · Công cụ/máy móc · Nâng cấp**.
- Không khóa theo level; hàng nào cũng mua được nếu đủ tiền và đủ điều kiện hạ tầng (xem I.5).
- **Giá đầu vào dao động** theo mùa và sự kiện (±10–25%), xem IV.7. Giống thường hoặc giống tốt (đắt hơn, năng suất +15%).
- **Mua chịu:** đại lý cho ghi sổ giống/phân, trả sau thu hoạch với lãi cao hơn vay thường (IV.5).
- Mua theo lô thì giá rẻ hơn; thành viên HTX được giá nhóm.
- Mua theo số lượng, có nút "mua đủ cho N ô".

#### I.3.5 Chế biến

- Công thức: `nguyên liệu + thời gian + (nhiên liệu/điện) + công → thành phẩm`.
- Có **hao hụt** và **phụ phẩm** thật, và phụ phẩm có thể dùng tiếp.

| Công thức | Thời gian | Hao hụt / phụ phẩm | Hạn dùng thành phẩm |
| --- | --- | --- | --- |
| Lúa → Gạo | 1 ngày | Hao 30%; ra **cám** (làm thức ăn gia súc) | Dài |
| Gạo → Bún khô | 1 ngày | Hao 10% | Dài |
| Rau cải → Dưa muối | 3 ngày | Hao 15% | Trung bình |
| Cà chua → Tương cà | 2 ngày | Hao 20% | Trung bình |
| Sữa → Phô mai | 3 ngày | Hao 25% | Trung bình |

- Thành phẩm giá cao hơn nguyên liệu 1.5–3 lần, nhưng chiếm công suất máy, tốn công, nhiên liệu và thời gian.
- Mỗi máy có hàng đợi (queue); nâng cấp để tăng số slot song song. Xưởng phải xây và có tiền điện.

#### I.3.6 Vận tải

> Sự cố vận chuyển và tuyến nguy hiểm xem Phần III.

- Hàng phải được **vận chuyển** tới chợ mới bán được (trừ chợ làng gần nhà).
- Mỗi phương tiện có: `tải trọng`, `tốc độ`, `chi phí/chuyến` (nhiên liệu + công), `độ bền`, `loại hàng chở được`.

| Phương tiện | Tải trọng | Thời gian | Chi phí/chuyến | Ghi chú |
| --- | --- | --- | --- | --- |
| Xe đẩy tay | 20 | Tức thì (chợ làng) | 0 | Mặc định |
| Xe bò | 60 | 1 ngày (đi tối, tới sáng) | 10 + 1 giờ công | Chợ huyện, giá mua 350 |
| Xe tải nhỏ | 200 | 0.5 ngày | 40 + 1 giờ công | Chợ thị trấn, giá mua 1800, cần giấy phép |
| Xe lạnh | 150 | 0.5 ngày | 80 + 1 giờ công | Chở hàng tươi không giảm chất lượng, giá mua 2600 |
| **Thuê xe ngoài** | Theo loại | Theo loại | 120 / chuyến | Không cần vốn mua xe, đắt hơn về lâu dài |

- **Lịch xe:** người chơi xếp hàng lên chuyến sắp tới và có thể làm việc khác trong lúc xe chạy. Không bị khóa chờ xe quay về nhờ có tùy chọn **thuê xe ngoài** hoặc **nhờ chuyến thương lái** (giá thấp, phụ thuộc uy tín).
- **Tuyến đường** (làng / huyện / thị trấn / thành phố): đi xa thì giá bán cao hơn nhưng tốn thời gian, nhiên liệu và rủi ro.
- **Sự cố vận chuyển:** hỏng xe, kẹt đường, mưa lũ làm trễ phiên chợ; hàng tươi chở xe thường bị giảm chất lượng, nắng nóng làm hỏng nhanh hơn.
- Xe có **độ bền** giảm theo số chuyến, cần bảo dưỡng; xem khấu hao ở IV.6.

#### I.3.7 Chợ (bán hàng)

> Tính cách chợ (Phần II). Thuế & phí (III.5). Mô hình giá, thương lái, hợp đồng (Phần IV). Nhóm hàng cá (Phần V).

- Mỗi chợ có **giờ họp** (xem I.6.4), bảng giá riêng và tính cách riêng.
- Giá bán gồm giá thị trường vùng và độ bão hòa cục bộ:

```
Giá bán = Giá_thị_trường_vùng × Hệ_số_chất_lượng × Hệ_số_cầu_cục_bộ × Hệ_số_sở_thích_chợ
Hệ_số_cầu_cục_bộ: mỗi đơn vị bán ra giảm 3% (sàn 60%), mỗi ngày hồi phục 10%
```

- Các kênh bán (chi tiết ở IV.3): **bán thẳng ở chợ** · **thương lái tới ruộng** · **hợp đồng bao tiêu** · **đơn hàng lẻ** · **phiên chợ/lễ hội** (nhu cầu một mặt hàng tăng trong vài ngày, không phát quà).
- Bán dồn một loại hàng sẽ bão hòa và dễ bị ép giá → khuyến khích **đa dạng hóa** cả mặt hàng lẫn kênh bán.

### I.4 Kinh tế & cân bằng

**Nguồn tiền (Source):** bán nông sản và sản phẩm, hợp đồng, đơn hàng lẻ, bán tài sản. *Vay vốn không phải thu nhập* và luôn đi kèm nghĩa vụ trả.
**Chỗ tiêu (Sink):** giống, thức ăn, phân thuốc, **công thuê**, nhiên liệu/điện, bảo dưỡng và khấu hao, thuê/mua đất, phí chợ, thuế, bảo hiểm, lãi vay, chi phí phòng vệ.

**Giá trị neo để cân bằng (số mẫu):**

| Neo | Giá trị |
| --- | --- |
| 1 giờ công (thuê công nhật) | 8 đồng (80 đồng/10 giờ) |
| 1 đơn vị thức ăn vật nuôi | 3 đồng |
| Thuê 1 ô / mùa | 40 đồng |
| Mua 1 ô (ô thứ 5) | 215 đồng |
| Xe bò / Xe tải nhỏ / Xe lạnh | 350 / 1800 / 2600 |
| Máy bơm / Tưới nhỏ giọt (8 ô) | 250 / 600 |
| Phí thành viên HTX | 20 đồng |

**Nguyên tắc hoàn vốn:** đầu tư nhỏ hoàn vốn trong **2–5 ngày**, đầu tư vừa (bơm, chuồng gà, kho) **8–15 ngày**, đầu tư lớn (xe, xưởng, đất) **20–40 ngày**. Đầu tư sai thời điểm (sai giá, sai mùa) có thể không hoàn vốn, đó là rủi ro thật. Biên lợi nhuận mỏng, nên quy mô và hiệu quả mới tạo ra khác biệt.

**Bảng cây trồng mẫu:**

| Cây | Giá giống | Thời gian (ngày) | Sản lượng/ô | Giá gốc | Lãi gộp/ô* | Mùa hợp | Đặc điểm |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Rau cải | 6 | 2 | 6 | 5 | 24 | Xuân, Thu, Đông | Tươi (hạn 2 ngày), tốn công, giá biến động mạnh |
| Khoai lang | 8 | 4 | 8 | 5 | 32 | Thu, Đông | Bền (hạn 15 ngày), hợp đất cát/đồi, ít công |
| Cà chua | 15 | 4 | 6 | 9 | 39 | Xuân, Thu | Tươi (hạn 4 ngày), dễ sâu bệnh |
| Ngô | 14 | 5 | 8 | 7 | 42 | Hạ, Thu | Bền (hạn 20 ngày), hợp đất sét/phù sa |
| Lúa nước | 12 | 7 | 14 | 6 | 72 | Xuân, Hạ | Bền (hạn 60 ngày), cần ruộng ngập nước, dồn công lúc gặt, có phụ phẩm (cám, rơm) |
| Dâu tây | 30 | 6 | 9 | 11 | 69 | Đông, Xuân | Tươi (hạn 2 ngày), hợp đất đồi, nên có nhà lưới |

\* *Lãi gộp/ô = Sản lượng × Giá gốc − Giá giống*, **chưa** trừ công, nước, phân, thuế, phí. Lãi ròng thực tế thấp hơn và thay đổi theo giá thị trường từng ngày.

Cây có lãi gộp/ngày cao (rau cải) lại tốn công, hàng tươi và dễ bão hòa; cây lãi/ngày thấp hơn (lúa) lại bền, ít công, có thể chờ giá. Sự đánh đổi này là cốt lõi của quyết định "trồng gì".

### I.5 Tiến trình & mở khóa (không còn level)

Không có XP, level hay phần thưởng phát ngẫu nhiên. **Tiến triển được đo bằng tài sản, năng lực sản xuất, dòng tiền và uy tín.** Mọi hạng mục mở khóa bằng **vốn + đất + thiết bị đi kèm + uy tín**, nên cái mới đến theo tốc độ người chơi kiếm tiền, không theo tốc độ cày điểm.

| Hạng mục | Điều kiện mở khóa (mẫu) |
| --- | --- |
| Trồng trọt cơ bản, cửa hàng, chợ làng, giếng tay | Có ngay từ đầu |
| Thuê/mua thêm ô đất | Có ngay từ đầu (xem I.3.1) |
| Chọn cây | Không khóa; bị giới hạn bởi mùa, loại đất, vốn mua giống |
| Vay HTX | Đóng phí thành viên 20 đồng; hạn mức ban đầu 150 |
| Nâng cấp kho | Chỉ cần tiền |
| Chuồng gà / vịt | Xây chuồng 150 + 1 ô trống (chuồng vịt cần ao hoặc ruộng nước gần) |
| Chuồng bò / heo | Xây chuồng 600 / 400 + 1 ô trống; nên có thú y quen (uy tín thú y ≥ 1) |
| Máy bơm, tưới nhỏ giọt, nhà lưới | Chỉ cần tiền |
| Xưởng chế biến | Có kho + xây xưởng 400 + công tơ điện 60 |
| Xe bò & chợ huyện | Mua xe 350, **hoặc** nhờ chuyến thương lái Bác Tư khi uy tín ≥ 3 |
| Thuê nhân công cố định | Sở hữu từ 8 ô trở lên (đủ việc); lương 60 đồng/ngày, trả cả khi rảnh |
| Vay ngân hàng | Có tài sản thế chấp (đất đã mua) + lịch sử trả nợ tốt |
| Xe tải & chợ thị trấn | Xe tải 1800 + giấy phép vận tải 100 + uy tín thương lái ≥ 5 |
| Kho lạnh, xe lạnh | Kho lạnh 1200 (+15 đồng/ngày điện); xe lạnh 2600 |
| Chợ thành phố, hợp đồng lớn | Có xe tải/xe lạnh + uy tín ≥ 6 với một người mua lớn + ≥ 1 năm sổ sách |
| Ao cá | Đào ao 500 + 1 ô đất |
| Thuyền & hồ lớn | Thuyền 900; có hồ trong bản đồ seed |

**Ghi nhận thay cho phần thưởng:** Sổ sách ghi các cột mốc (vụ đầu tiên có lãi, lần đầu trả hết nợ, năm đầu...) chỉ để xem lại, **không tặng vật phẩm hay tiền**.

**Mục tiêu tự đặt:** người chơi tự đặt chỉ tiêu cho mình (đạt 20 ô, trả hết nợ HTX, lãi ròng 3.000 đồng/năm) và game theo dõi tiến độ. Không có phần thưởng ngoài kết quả thật trên nông trại.

**Nhịp độ mục tiêu** (theo *thời gian chơi hiệu dụng*, đã tính tua thông minh):

| Mốc | Điều người chơi nên đạt |
| --- | --- |
| ≤ 3 phút | Thu hoạch và bán lứa rau đầu tiên |
| ≤ 10 phút | Đủ dòng tiền cho **quyết định lớn đầu tiên** (thuê thêm ô, mua bơm, hay vay HTX) |
| ≤ 20–30 phút | Hệ thống mới thứ hai (chuồng gà hoặc kho lớn, chợ huyện) |
| ≤ 1 giờ | Qua trọn một mùa, có xưởng chế biến hoặc xe |
| 1–2 giờ | Hết năm đầu: tất toán sổ sách, nộp thuế, trả nợ HTX |

### I.6 Thời gian, giờ công & nhịp độ

#### I.6.1 Thời gian cơ bản

- Ngày trong game **tự chạy liên tục**. 1 ngày game = **5 phút thật** (ở ×1), 1 mùa = 7 ngày (~35 phút), 1 năm = 4 mùa (28 ngày).
- Mỗi ngày có **4 buổi** (Sáng / Trưa / Chiều / Tối), mỗi buổi ~75 giây ở ×1.
- **Tính theo timestamp** (không đếm bằng `setInterval`), vì trình duyệt giảm tốc tab đang ẩn.
- Không có timer chờ để ép chơi hay ép trả tiền vì game không có monetization.

#### I.6.2 Điều khiển thời gian & tua thông minh

- Nút điều khiển: ⏸ Tạm dừng · ▶ ×1 · ⏩ ×2 · ⏩⏩ ×4 · **⏭ Chờ đến việc tiếp theo**.
- **⏭ Chờ đến việc tiếp theo (tua thông minh):** tua nhanh (~×8) cho tới khi có **một trong các sự kiện cần chú ý**: cây cần tưới, cây chín, phiên chợ mở, xe về, cảnh báo/sự kiện, đầu ngày mới. Một ngày không có việc chỉ mất khoảng 40 giây.
- **Thời gian thích ứng (tùy chọn bật):** game tự tăng tốc khi không có việc và tự về ×1 khi có việc hoặc cảnh báo.
- **Kết thúc ngày:** nút nhảy thẳng tới bình minh hôm sau khi người chơi đã xong việc.
- **Thao tác hàng loạt:** gieo/tưới/bón/thu hoạch theo hàng, theo cụm, hoặc "tất cả ô đủ điều kiện". Tiêu hao giờ công như nhau, giảm số lần bấm.
- Sự kiện lớn **tự động tạm dừng** (có thể tắt).

#### I.6.3 Giờ công

- Mỗi ngày người chơi có **10 giờ công**, làm mới vào bình minh; giờ không dùng sẽ mất (không tích lũy).
- Mọi việc tay đều tốn giờ công. Giờ công là **ngân sách trừu tượng**, thao tác vẫn tức thời, không chạy đồng hồ game.
- **Làm thêm giờ:** tối đa +3 giờ/ngày; mỗi giờ làm thêm trừ 1 giờ công của ngày hôm sau (mệt).
- **Cách có thêm giờ công:**
  - **Công nhật:** +10 giờ cho 1 ngày, 80 đồng (cao điểm gặt hái ×1.5).
  - **Công cố định:** lương 60 đồng/ngày, làm 8 giờ/ngày theo **chỉ thị** người chơi đặt (tự tưới, tự thu hoạch, tự cho ăn theo quy tắc), kể cả lúc người chơi offline.
  - **Máy móc:** máy cày, bơm, hệ thống tưới giảm giờ công mỗi việc (cần nhiên liệu/điện, bảo dưỡng, khấu hao).

| Việc | Giờ công / ô (hoặc con) | Có máy |
| --- | --- | --- |
| Cày đất | 0.5 | 0.15 (máy cày) |
| Gieo hạt | 0.25 | |
| Tưới | 0.25 | 0.05 (hệ thống tưới) |
| Bón phân | 0.2 | |
| Làm cỏ / kiểm sâu | 0.2 | |
| Thu hoạch | 0.3 | |
| Cho ăn, thu sản phẩm (mỗi con) | 0.05 | |
| Vệ sinh chuồng (mỗi chuồng/ngày) | 0.5 | |
| Chất hàng lên xe & đi chợ (mỗi chuyến) | 1 | |
| Một lượt câu cá | 0.25 | Cần câu tự động: 0 |

Ví dụ 8 ô rau cải cần ~14 giờ công cho cả chu kỳ 2 ngày, tức khoảng 7 giờ/ngày. Quá 12 ô là hết giờ công, buộc phải thuê công hoặc mua máy, một quyết định mở rộng có thật.

#### I.6.4 Nhịp trong ngày

| Buổi | Đặc điểm |
| --- | --- |
| **Sáng** | Mát, tưới hao nước ít; chợ làng, chợ huyện họp; cá cắn mạnh |
| **Trưa** | Nắng gắt: tưới hao nước nhiều, việc ngoài trời tốn ×1.5 giờ công; chợ vắng; hàng tươi nhanh xuống chất lượng nếu để ngoài nắng |
| **Chiều** | Tưới tốt; chợ làng họp phiên chiều; thu hoạch chuẩn bị cho chợ sáng mai; cá cắn mạnh |
| **Tối** | Việc trong nhà (chế biến, cho ăn, sổ sách); xe đêm xuất bến; trộm vặt dễ ra tay hơn; kết thúc ngày |

**Giờ họp chợ (mẫu):** Chợ làng: Sáng và Chiều. Chợ huyện: Sáng. Chợ thị trấn: Sáng và Trưa. Chợ đầu mối: Tối (mua số lượng lớn, giá thấp). Muốn kịp chợ huyện sáng mai thì phải chất hàng và cho xe xuất bến vào chiều/tối hôm trước.

#### I.6.5 Vắng mặt (offline)

- Khi mở lại, game tính bù thời gian đã trôi qua, **tối đa 1 giờ thật** ở mức "Thực tế" (~12 ngày game); "Dễ thở" tối đa 8 giờ; "Khắc nghiệt" tối đa 30 phút.
- Trong lúc vắng mặt:
  - **Người nhà trông coi:** tưới ở mức tối thiểu để cây không chết, cho ăn từ kho (hết kho thì đói), **không thu hoạch, không bán, không chế biến thủ công**.
  - **Công cố định** (nếu có) vẫn làm theo chỉ thị.
  - **Sự kiện xấu vẫn có thể xảy ra**, thiệt hại ×0.5 ở mức "Thực tế" (người nhà xử lý được một phần), ×1 ở "Khắc nghiệt", không xảy ra ở "Dễ thở".
  - Cây chín không thu thì để trên đồng, hao dần sau 2 ngày.
- **Hạn nộp thuế, hạn trả nợ và hạn giao hợp đồng** được lùi tương ứng với thời gian vắng mặt, để người chơi không bị phạt vì lúc không thể thao tác. Lãi vay vẫn tính theo ngày trôi qua.
- Mọi hệ thống chạy qua cùng hàm `tick(deltaTime)`, offline dùng lại hàm này với delta lớn.

### I.7 Cấu trúc dữ liệu (ví dụ)

```json
{
  "crop": {
    "id": "rice", "name": "Lúa nước",
    "seed_price": 12, "grow_days": 7, "yield": 14, "base_price": 6,
    "seasons": ["spring", "summer"],
    "temp_range": { "optimal": [22, 32], "min": 15, "max": 38 },
    "stages": [
      { "id": "seedling", "water_need": 3 },
      { "id": "growth",   "water_need": 2 },
      { "id": "ripening", "water_need": 1 }
    ],
    "soil_factor": { "alluvial": 1.3, "clay": 1.1, "sand": 0.6, "hill": 0.7 },
    "shelf_life_days": 60, "labor_per_plot": 1.9,
    "by_products": [{ "id": "straw", "qty": 4 }]
  },
  "vehicle": {
    "id": "ox_cart", "capacity": 60, "trip_days": 1, "fuel_cost": 10, "labor": 1,
    "durability": 100, "routes": ["village", "district"], "cold": false, "price": 350
  },
  "labor": {
    "id": "day_laborer", "hours": 10, "price": 80,
    "peak_multiplier": { "harvest_season": 1.5 }
  }
}
```

Tách toàn bộ dữ liệu (cây, vật nuôi, công thức, xe, giá, sự kiện) ra **file cấu hình** (JSON/CSV) để chỉnh cân bằng không cần sửa code.

### I.8 Hướng kỹ thuật cho bản Web

- **Công nghệ gợi ý:** HTML5 + JavaScript/TypeScript. Giao diện tab/menu dùng DOM (HTML/CSS), khu đất và chuồng trại vẽ bằng Canvas hoặc thư viện như **Phaser / PixiJS**; biểu đồ giá và sổ sách vẽ bằng thư viện nhẹ (Canvas hoặc SVG).
- **Không cần backend:** không đăng nhập, không máy chủ, không bảng xếp hạng.
- **Lưu game:** `IndexedDB` (hoặc `localStorage`), tự lưu mỗi 30 giây và khi đóng tab. Thêm **Xuất/Nhập file save** để chống mất dữ liệu.
- **Responsive:** chạy được trên laptop và điện thoại (nút to, kéo/chạm, thao tác hàng loạt giảm số lần bấm).
- **Kiến trúc:** tách `Game State` – `Systems` – `UI`. Các hệ thống chính: `weather`, `soil`, `crop`, `livestock`, `market`, `finance`, `labor`, `logistics`, `events`. Mọi số liệu đọc từ file cấu hình JSON.
- **Vòng mô phỏng:** `tick(deltaTime)`. Thị trường vùng cập nhật **1 lần/ngày**, thời tiết 1 lần/ngày kèm dự báo; các hệ thống còn lại theo tick.
- **Tua thông minh:** bộ lập lịch tính trước mốc sự kiện kế tiếp (cây chín, cây cần tưới, chợ mở, xe về, đầu ngày) rồi nhảy tới mốc đó; offline catch-up dùng cùng cơ chế.
- Mọi ngẫu nhiên đi qua RNG có seed (xem II.8).

### I.9 Phong cách hình ảnh & cảm giác chơi

- **Hình ảnh:** bảng màu ấm, dễ đọc, UI dạng gỗ/giấy; các trạng thái (đói, khát, bệnh, thiếu nước) thể hiện bằng biểu cảm và biểu tượng rõ ràng, tập trung vào khả năng đọc nhanh tình hình trang trại.
- **Chưa chốt:** giữ phong cách chibi/cute hay chuyển sang bán thực tế (xem VI.3). Các hệ thống trong tài liệu này không phụ thuộc vào lựa chọn đó.
- **Thông tin là phần của trò chơi:** biểu đồ giá, dự báo thời tiết, sổ lãi/lỗ, thẻ cây có tiến độ và điều kiện, tất cả trình bày gọn, ưu tiên đọc nhanh.
- **Phản hồi nhỏ:** cây nảy khi thu hoạch, đồng xu bay vào ví khi bán, xe quay bánh khi vận chuyển, dòng thông báo ngắn khi giá đổi mạnh.
- **Âm thanh:** nhạc nền nhẹ theo mùa, tiếng vật nuôi, tiếng chợ.
- **Hậu quả thật nhưng công bằng:** thất bại có nguyên nhân đọc được (không chuẩn bị, vay quá sức, phụ thuộc một đầu ra), có báo trước và luôn có đường gây dựng lại có giá phải trả (III.7), không có phần thưởng "cứu" miễn phí.
- **Nhân vật dẫn chuyện:** 1 NPC (bác nông dân) chỉ xuất hiện khi hướng dẫn và nhắc việc quan trọng, có thể tắt; bản tin chợ do NPC thương lái và bảng tin làng đảm nhiệm.

### I.10 Ảnh hưởng của các quyết định đã chốt

| Quyết định | Hệ quả thiết kế |
| --- | --- |
| Web | Lưu local, tối ưu tải nhanh, asset nhẹ (sprite sheet), responsive |
| Real-time | Tick theo timestamp, nút tạm dừng/tăng tốc, **tua thông minh**, offline catch-up có giới hạn |
| Single-player offline | Chợ, NPC, thương lái, giá vùng do hệ thống mô phỏng; không bảng xếp hạng |
| Chân thực | Chi phí đầy đủ, giờ công, giá mô phỏng, vay nợ, vật nuôi có vòng đời, rủi ro có hậu quả thật; ba mức độ khó |
| Không monetization | Không năng lượng/timer/tiền tệ premium; cân bằng chỉ phục vụ độ vui và thử thách |
| Không hệ thống thưởng | Không XP/level, quà nhiệm vụ, quà hỗ trợ; tiến triển đo bằng tài sản, dòng tiền, uy tín |

## Phần II. Tính khả biến: mỗi lần chơi một khác

### II.1 Nguyên tắc chung

1. **Khác có ý nghĩa:** thứ ngẫu nhiên phải làm thay đổi *quyết định* (trồng gì, bán đâu, vay hay không), không chỉ đổi số cho vui.
2. **Seed mỗi save:** khi tạo game mới, sinh 1 `world_seed`. Toàn bộ nội dung ngẫu nhiên suy ra từ seed này, nên save/load luôn cho kết quả giống nhau (không thể load lại để "quay số" sự kiện tốt).
3. **Luôn chơi được:** mọi seed đều phải có đường đi khả thi (xem II.8).
4. **Hậu quả thật nhưng công bằng:** ngẫu nhiên tạo thử thách và sự bất định như đời thực, có báo trước và có cách đối phó, không có thất bại mà người chơi không thể đọc hay chuẩn bị.
5. **Dữ liệu hóa:** mọi pool (loại đất, tính cách chợ, đề nghị hợp đồng, sự kiện) nằm trong file JSON, thêm nội dung không cần sửa code.

### II.2 Tổng quan 5 lớp

| Lớp | Sinh khi nào | Thay đổi cái gì | Người chơi phải đổi gì |
| --- | --- | --- | --- |
| 1. Đất & bản đồ | Tạo game | Chất lượng/loại đất từng ô, vị trí sông/ao/hồ | Chọn cây hợp đất |
| 2. Tính cách chợ | Tạo game + đổi chậm theo năm | Món ưa chuộng, kiểu trả giá, giờ họp | Chọn nơi bán, mặt hàng chủ lực |
| 3. Hồ sơ khởi đầu | Tạo game | Vốn, đất, nợ, vật phẩm, đặc tính | Cách mở màn |
| 4. Bối cảnh năm & hợp đồng đầu mùa | Đầu mỗi năm / mùa | Xu hướng thời tiết, giá; đề nghị hợp đồng từ làng và thương lái | Kế hoạch sản xuất theo mùa |
| 5. Chuỗi sự kiện | Khi điều kiện thỏa | Cơ hội/hệ quả theo hành động | Quan hệ với NPC, rủi ro |

### II.3 Lớp 1: Đất & bản đồ

Mỗi ô đất có **loại đất** và **chất lượng** sinh từ seed.

| Loại đất | Hợp với | Kém với | Đặc điểm |
| --- | --- | --- | --- |
| Phù sa | Lúa nước, rau cải | Cây ưa khô | Phì cao, giữ nước tốt, dễ ngập khi lũ |
| Đất cát | Khoai lang, dưa | Lúa | Thoát nước nhanh, cần tưới nhiều |
| Đất sét | Lúa nước, ngô | Rau củ | Giữ nước, lớn chậm |
| Đất đồi | Dâu tây, cây ăn quả | Lúa | Phì thấp nhưng ít sâu bệnh, dễ hạn |

- **Hệ số đất:** mỗi cây có bảng hệ số theo loại đất (0.6 – 1.3), nhân vào công thức sản lượng ở mục I.3.1.
- **Bố cục:** các ô sinh theo cụm (vùng phù sa cạnh sông, vùng đồi phía sau...), có thể có **ô đặc biệt** (gần suối nước, đất giàu khoáng). **Sông/ao/hồ** cũng sinh theo seed (Phần V).
- **Cải tạo đất:** bón phân hữu cơ, cày sâu, làm bậc thang có thể nâng loại đất lên một bậc (tốn tiền và giờ công), cho người chơi hướng đầu tư dài hạn.
- Vị trí quyết định rủi ro: đất ven sông dễ lũ, đất đồi dễ hạn (liên kết Phần III).

### II.4 Lớp 2: Tính cách chợ

Mỗi chợ có 3 thuộc tính sinh từ seed:

**a) Sở thích (Demand profile):** 2–3 nhóm hàng được trả giá +20–40%, 1–2 nhóm bị trả giá thấp. **b) Tính cách (Trait):** chọn 1 từ pool. **c) Giờ họp** (xem I.6.4).

| Tính cách | Hiệu ứng |
| --- | --- |
| Kén chất lượng | Chỉ trả giá cao cho hàng chất lượng ≥ ⭐⭐⭐ |
| Chuộng hàng tươi | Hàng tươi +25%, hàng khô −15% |
| Giá ổn định | Cầu hồi phục nhanh (20%/ngày) nhưng giá không bao giờ vượt trần |
| Chợ đầu mối | Mua số lượng lớn, giá thấp, ít bão hòa |
| Chợ biến động | Giá lên xuống mạnh (±30%), dễ lãi lớn hoặc ế |
| Thương lái chi phối | Giá ổn định nhưng thấp hơn ~10%; nếu bán quá 60% doanh thu qua đây sẽ bị ép giá thêm (xem III.4) |

- Các chợ **dịch chuyển chậm**: mỗi năm game, 1 chợ có thể đổi sở thích hoặc tính cách, buộc người chơi theo dõi thay vì thuộc lòng.
- Người chơi **khám phá** sở thích chợ bằng cách bán thử, hỏi thương lái hoặc xem bảng tin chợ (thông tin mở dần theo uy tín, xem IV.4).

### II.5 Lớp 3: Hồ sơ khởi đầu

Người chơi chọn 1 trong 3 hồ sơ được rút ngẫu nhiên (hoặc chọn thủ công ở chế độ tự do).

| Hồ sơ | Vốn | Đất | Vật phẩm / đặc tính | Phong cách |
| --- | --- | --- | --- | --- |
| Nông dân chăm chỉ | 250 | 6 ô | Việc đồng áng tốn ít hơn 10% giờ công | Trồng trọt thuần |
| Chủ trại | 400 | 3 ô + chuồng gà (3 con) | Vật nuôi nhanh đạt hài lòng, có thú y quen sẵn | Chăn nuôi sớm |
| Thương nhân | 700 | 2 ô | Xe bò sẵn, uy tín thương lái 2, bán ở chợ xa +10% | Buôn bán, vận tải |
| Đầu bếp | 400 | 3 ô | Xưởng chế biến nhỏ có sẵn, thành phẩm +15% giá | Chế biến sớm |
| Người thừa kế | 80 | 8 ô đất tệ | Có vài giống cây quý, **gánh khoản nợ gia đình 400 đồng** (lãi 2%/mùa) | Khởi đầu khó |

Mỗi hồ sơ là một **đặc tính cố định đến hết game** (nhỏ, không phá cân bằng), cộng với điều kiện khởi đầu khác nhau. Đây là *điều kiện khởi đầu*, không phải phần thưởng.

### II.6 Lớp 4: Bối cảnh năm & hợp đồng đầu mùa

**Bối cảnh năm** (sinh từ seed, đầu mỗi năm, công bố một phần qua bảng tin): xu hướng thời tiết và giá của cả năm, ví dụ *năm ít mưa*, *năm được mùa mất giá*, *năm giá phân tăng*, *năm nhiều bão*. Người chơi đọc tin, tự đoán và điều chỉnh kế hoạch, không có thưởng thêm hay bớt theo "chủ đề".

**Hợp đồng đầu mùa:** đầu mỗi mùa, làng/HTX/thương lái chào 1–2 **đề nghị hợp đồng** từ một pool. Hợp đồng trả bằng **tiền thật theo giá thỏa thuận**, có điều khoản giao hàng và **phạt khi giao thiếu** (xem IV.3).

- Ví dụ: *"HTX cần 60 bao lúa trước hội thu hoạch, giá 7/bao"* (thị trường dự kiến 6), *"Quán ăn trong làng đặt rau tươi mỗi tuần, giá cố định"*, *"Hội chợ phô mai: nộp 10 phô mai chất lượng cao giá 45"*.
- **Điều kiện sinh:** chỉ sinh đề nghị mà người chơi **đã có hạ tầng** để thực hiện; đôi khi cố ý rủ người chơi ra khỏi vùng an toàn (ví dụ chỉ trồng một loại thì đề nghị loại khác).
- **Không bắt buộc:** từ chối đề nghị thì không phạt; chỉ khi **đã ký** mới có nghĩa vụ.
- **Hợp đồng thử thách:** giá cao hơn, hạn gắt hơn, phạt nặng hơn, chất lượng tối thiểu cao hơn.

### II.7 Lớp 5: Chuỗi sự kiện có hệ quả

Mô hình mỗi sự kiện: `Điều kiện → Sự kiện → Lựa chọn → Hệ quả (có thể mở sự kiện tiếp)`.

**Ví dụ: Thương lái Bác Tư (độ `uy tín`)**

```
Bán ≥ 50 sản phẩm cho Bác Tư        → uy tín +1
uy tín ≥ 3                          → mở sự kiện "Bác Tư giới thiệu chợ huyện"
  ├─ Nhận: mở tuyến chợ huyện sớm, nhưng phải giao đủ 20 hàng/tuần
  └─ Từ chối: không thay đổi, uy tín giữ nguyên
Giao thiếu hàng 2 tuần liền         → uy tín −1, Bác Tư tạm mua giá thấp
```

**Các nhóm sự kiện:**

- **Quan hệ NPC:** thương lái, thú y, thợ máy (giảm phí sửa xe nếu thân), cán bộ HTX, cán bộ tín dụng.
- **Thiên nhiên:** năm hạn, mưa nhiều, dịch sâu. Tác động lên cả vùng đất theo seed.
- **Cơ hội:** thương nhân ghé bán giống tốt (kèm phí nhập), hội chợ nông sản (cầu một nhóm hàng tăng).
- **Thị trường:** nhà máy chế biến mở trong vùng (cầu tăng một mặt hàng), nhóm thương lái ngừng mua...
- **Hệ quả dài hạn:** độc canh nhiều mùa → đất yếu, sau đó có sự kiện "chuyên gia nông nghiệp ghé thăm" gợi ý luân canh (gợi ý, không phải quà).

Một số sự kiện chỉ xảy ra **một lần mỗi save**, nên mỗi game có "câu chuyện" riêng.

### II.8 Kỹ thuật & bảo đảm cân bằng

**Sinh số ngẫu nhiên có seed:** dùng bộ RNG có seed (ví dụ `mulberry32`), mỗi hệ thống có luồng riêng để thêm tính năng không làm đổi kết quả cũ:

```js
const rng = makeRng(hash(world_seed + ":market"));        // chợ
const dayRng = makeRng(hash(world_seed + ":day:" + day)); // sự kiện theo ngày
```

- Sự kiện mỗi ngày dùng `seed + số_ngày`, nên load lại save ở cùng ngày cho cùng sự kiện (chống "quay số").
- **Offline catch-up:** quy tắc vắng mặt theo mục I.6.5 và mức độ khó ở III.9.

**Kiểm tra khả thi khi sinh seed (validator):**

- Có ít nhất **2 cây** lãi gộp ≥ 20/ô trên đất của người chơi ở mùa đầu.
- Có ít nhất 1 chợ trả giá ≥ giá gốc cho cây khả thi đó.
- Không sinh hai sự kiện tiêu cực liên tiếp trong 3 ngày đầu.
- **Mô phỏng bot kiểm tra:** một chiến lược tối thiểu (trồng 2 loại cây khả thi, bán đều hai chợ) phải có tiền mặt dương sau mùa đầu và đạt "quyết định lớn đầu tiên" trong khoảng nhịp độ ở I.5.
- Nếu validator thất bại → sinh lại với `seed + 1`.

**Cấu trúc dữ liệu mẫu:**

```json
{
  "market_trait": { "id": "picky", "quality_min": 3, "price_bonus": 0.3 },
  "contract_offer": {
    "id": "coop_rice", "buyer": "coop", "item": "rice", "qty": 60,
    "unit_price": 7, "min_quality": 2, "deadline_days": 10,
    "penalty_rate": 0.2, "optional": true, "requires": ["crop:rice"]
  },
  "event": {
    "id": "traveler_visit", "once_per_save": true,
    "conditions": { "season": ["autumn"], "min_assets": 600 },
    "choices": [
      { "text": "Mua giống tốt", "effects": [{ "gold": -200 }, { "item": "rare_seed", "qty": 3 }] },
      { "text": "Từ chối", "effects": [] }
    ]
  }
}
```

### II.9 Chế độ chơi

- **Chế độ Câu chuyện năm:** seed mỗi save, mỗi năm có bối cảnh riêng (II.6), độ khó mặc định "Thực tế".
- **Chế độ tự do (sandbox):** chọn hồ sơ, nhập seed, chọn mức độ khó, bật/tắt từng nhóm rủi ro.
- **Seed chia sẻ:** vì không có online, người chơi có thể gửi `world_seed` cho bạn bè để cùng thử một bản đồ (không cần server).

## Phần III. Chướng ngại & Rủi ro

### III.1 Nguyên tắc thiết kế

1. **Báo trước, có cách đối phó, nhưng không xóa được rủi ro:** gần như mọi chướng ngại có dấu hiệu cảnh báo và ít nhất một cách phòng/chữa. Thua vì không chuẩn bị chứ không phải vì xui. Phòng vệ giảm rủi ro nhưng không bao giờ đưa về 0.
2. **Tổn thất thật, có trần theo độ khó:** một sự kiện chỉ lấy tối đa 30% / 50% / 70% loại tài sản bị ảnh hưởng (Dễ thở / Thực tế / Khắc nghiệt). **Không có gói hỗ trợ miễn phí** khi thua lỗ; lưới an toàn có cái giá (III.7).
3. **Mối đe dọa đời thường:** thời tiết, dịch bệnh, giá cả, sự cố máy móc, trộm vặt. **Không có băng nhóm tội phạm, bảo kê hay cướp đường.** Áp lực lên người chơi đến từ thị trường và kinh tế (III.4).
4. **Rủi ro tỉ lệ với quy mô:** trang trại càng lớn thì dịch lan rộng hơn, thuế nhiều hơn, dễ bị ép giá hơn; đổi lại có nhiều công cụ phòng vệ và đa dạng hóa hơn.
5. **Có thể chỉnh độ khó:** Dễ thở / Thực tế / Khắc nghiệt (III.9), và bật/tắt từng nhóm trong chế độ tự do.

### III.2 Danh mục chướng ngại

| Nhóm | Chướng ngại | Tác động chính | Báo trước | Đối phó |
| --- | --- | --- | --- | --- |
| 🌦️ Thiên nhiên | Hạn hán | Đất mất ẩm nhanh, cây chậm lớn | Dự báo 1–2 ngày | Hệ thống tưới, giếng, bể chứa, phủ rơm, cây chịu hạn |
|  | Bão / Lũ | Hỏng cây ở ô thấp, ngập đường, chậm xe | Dự báo 1 ngày | Nhà lưới, đê, thu hoạch sớm |
|  | Sương giá / Nóng gắt | Cây trái vụ lớn chậm/chết yếu, vật nuôi giảm sức khỏe | Dự báo | Nhà kính, che nắng, quạt/máy sưởi chuồng |
|  | Dịch sâu diện rộng | Ăn mất cây trên nhiều ô | Dấu hiệu ở rìa ruộng | Thuốc, bẫy, luân canh, chim ưng giữ ruộng |
| 🦠 Dịch bệnh | Dịch vật nuôi (cúm gia cầm, tả heo, bò ốm) | Giảm sản phẩm, lây giữa chuồng, có thể chết | Con vật ho/ủ rũ, tin vùng bên | Vắc-xin, vệ sinh, chuồng cách ly, thú y |
|  | Bệnh cây lan | Giảm sản lượng cả cụm | Lá đổi màu | Thuốc, luân canh, nhổ bỏ ô bệnh |
| 🦊 An ninh | Trộm vặt | Mất 5–10% hàng trong kho/chuồng | Dấu chân, ổ khóa hỏng | Hàng rào, chó giữ nhà, khóa kho, đèn |
| 💰 Kinh tế | Thuế & phí | Trừ tiền định kỳ | Thư báo, hạn nộp | Mục III.5 |
|  | Giá sụp / được mùa mất giá | Giá 1 nhóm hàng −20–35% vài ngày đến vài tuần | Tin chợ, tin thời tiết cả vùng | Tích trữ kho, hợp đồng giá cố định, chế biến, chuyển chợ |
|  | Thương lái ép giá | Giảm giá 5–15% khi phụ thuộc một đầu ra | Giá chào giảm dần | Mục III.4 |
|  | Giá đầu vào tăng (giống, phân, thức ăn, xăng) | Chi phí tăng 10–25% | Tin giá, đại lý báo | Mua sớm trước vụ, mua nhóm qua HTX, tự sản xuất thức ăn |
|  | Lãi suất tăng | Lãi vay thả nổi tăng 0.5–1%/mùa | Tin ngân hàng | Vay lãi cố định, trả nợ sớm |
|  | Kiểm tra chất lượng | Phạt nếu bán hàng chất lượng thấp hoặc hàng quá hạn | Thư báo | Giữ chất lượng ≥ ngưỡng, bỏ hàng hỏng |
| 🔧 Sự cố | Hỏng xe/máy | Dừng hoạt động, tốn tiền sửa | Độ bền giảm dưới 30% | Bảo dưỡng định kỳ, thợ máy NPC |
|  | Sự cố vận chuyển (kẹt đường, hỏng xe giữa đường, hàng dập nát) | Trễ phiên chợ, hàng giảm chất lượng, mất tối đa 20% lô hàng | Dự báo mưa/lũ, độ bền xe thấp | Chọn tuyến khác, xe tốt, xe lạnh, thuê xe ngoài |
|  | Cháy kho | Mất hàng trong kho | Mùa khô, dây điện cũ | Kho phòng cháy, bảo hiểm |
|  | Mất điện | Kho lạnh/máy chế biến ngừng, hàng tươi hỏng | Bảng tin điện lực | Máy phát điện |

### III.3 Cơ chế chung

**Xác suất xảy ra mỗi ngày:**

```
P = P_gốc × Hệ_số_seed × Hệ_số_quy_mô × (1 − Mức_phòng_vệ)
```

- `Hệ_số_seed`: đất ven sông dễ lũ, đất đồi dễ hạn, tuyến xa dễ gặp sự cố (liên kết lớp Đất và Chợ ở Phần II).
- `Hệ_số_quy_mô`: số ô, số vật nuôi, mật độ chuồng (dịch lan nhanh khi nuôi dày).
- `Mức_phòng_vệ`: tổng các công trình phòng vệ đã xây (0 → tối đa 0.8). Không bao giờ về 0 rủi ro.

**Quy tắc an toàn công bằng** (không phải quà, chỉ để người chơi mới có thời gian học):

- 3 ngày đầu và 1 mùa đầu: chỉ có thiên tai nhẹ và biến động giá bình thường.
- Tối đa **1 sự kiện lớn mỗi 3 ngày**; sau sự kiện lớn có "thời gian bình yên".
- Mỗi chướng ngại có **điều kiện kích hoạt theo tình trạng thật** (thuế khi sở hữu đất; thương lái ép giá khi phụ thuộc một đầu ra; dịch lớn khi chuồng đủ đông).
- Không có cơ chế tặng tiền hay vật phẩm khi người chơi thua lỗ.

**Bảo hiểm Hợp tác xã (tab Làng):**

- Phải là thành viên HTX; phí khoảng 3% giá trị tài sản được bảo hiểm mỗi mùa.
- Bồi thường 50–70% thiệt hại do thiên tai, dịch bệnh, cháy.
- **Không bảo hiểm:** thuế, giá sụp, thiệt hại do bất cẩn (bỏ đói, không bảo dưỡng), mất hàng do để quá hạn.

### III.4 Áp lực thị trường (thay cho xã hội đen)

Áp lực lên người chơi lớn đến từ **sự phụ thuộc và vị thế yếu**, không từ băng nhóm. Ba dạng chính:

**1. Phụ thuộc một đầu ra.** Khi trên 60% doanh thu 30 ngày gần nhất đến từ một người mua/một chợ, người mua bắt đầu ép giá:

```
Phát hiện phụ thuộc một đầu ra
Bác Tư giảm giá chào 5–15% trong 1 tuần
├─ Chấp nhận      → doanh thu giảm, uy tín giữ nguyên
├─ Thương lượng   → xác suất theo uy tín & mức cầu; thành công thì còn giảm 3–7%
└─ Chuyển kênh    → bán chợ huyện hoặc ký hợp đồng với HTX: tốn vận tải, thoát phụ thuộc
```

**2. Bán trong thế yếu.** Khi hàng tươi sắp hỏng, kho đầy, hoặc nợ sắp đến hạn, thương lái nhận ra và hạ giá chào. Người chơi chuẩn bị kho lạnh, chế biến và dòng tiền sẽ ít bị ép hơn.

**3. Sốc thị trường.** Giá sụp khi cả vùng được mùa, giá đầu vào tăng, chợ đóng tạm do lũ/sạt đường. Xem mô hình giá ở IV.2.

Cách thoát chung: **đa dạng hóa mặt hàng và kênh bán**, hợp đồng giá cố định, chế biến và kho lạnh để chờ giá, bán chung qua HTX. Điều này thay cho các cơ chế "trả phí/đánh nhau" của băng nhóm ở bản 1.

### III.5 Thuế & phí

| Loại | Mốc nộp | Công thức mẫu | Ghi chú |
| --- | --- | --- | --- |
| Thuế đất | Cuối mùa | `Số_ô_sở_hữu × Mức_thuế` | Ô thuê không chịu thuế đất; ô mới mua miễn 1 mùa |
| Phí thủy lợi | Cuối mùa | Theo số ô có tưới | Thành viên HTX được giảm |
| Phí chợ / thuế bán hàng | Khi bán | 3–5% giá trị bán | Tự trừ khi bán |
| Thuế thu nhập | Cuối năm | 5–15% phần lợi nhuận vượt ngưỡng (lũy tiến) | Được khấu trừ chi phí đầu tư thật (máy móc, hạ tầng) |
| Phí nhập giống | Khi mua giống từ thương nhân xa | 10% | Chỉ khi nhập từ nguồn xa |
| Giấy phép | Theo hạng mục | Xe tải, câu cá sông công cộng | Phí cố định hằng năm |

- **Nộp trễ:** phạt lãi, cho trả góp; trễ nghiêm trọng thì xử lý như nợ quá hạn (III.7), không tịch thu ngay.
- **Giảm thuế chỉ qua cơ chế thật:** khấu trừ chi phí đầu tư và tư cách thành viên HTX. **Không có giảm thuế như phần thưởng nhiệm vụ.**
- Thuế là **money sink** chính ở giai đoạn cuối, chặn tích tiền vô hạn.

### III.6 Công trình & công cụ phòng vệ

| Công trình | Chống | Hiệu quả (mẫu) |
| --- | --- | --- |
| Hàng rào, chó giữ nhà | Trộm vặt, thú hoang | −40% xác suất, chó phát hiện thêm |
| Khóa kho, đèn/camera | Trộm kho | −50% mất hàng |
| Giếng, bể chứa, hệ thống tưới | Hạn hán | Giảm tiêu hao nước 50% |
| Nhà lưới / nhà kính | Bão, sương giá, dịch sâu | Bảo vệ 1 cụm ô |
| Đê / cống thoát nước | Lũ | Bảo vệ các ô thấp |
| Chuồng cách ly + vắc-xin | Dịch vật nuôi | Chặn lây, giảm thời gian ốm |
| Kho phòng cháy | Cháy | −70% thiệt hại |
| Máy phát điện | Mất điện | Giữ kho lạnh/xưởng chạy |
| Bảo dưỡng định kỳ | Hỏng xe/máy, sự cố vận chuyển | −50% xác suất, tốn công và tiền phụ tùng |

Phòng vệ cũng có **chi phí duy trì** (cho chó ăn, nhiên liệu máy phát, phụ tùng) nên người chơi phải cân nhắc đầu tư.

### III.7 Khủng hoảng tài chính & lưới an toàn

Không còn gói hỗ trợ "pity" hay tặng vốn khởi động lại. Khi thiếu tiền, người chơi có các lựa chọn **đều có cái giá**:

| Lưới an toàn | Cách hoạt động | Cái giá |
| --- | --- | --- |
| **Bảo hiểm HTX** | Bồi thường 50–70% thiệt hại thiên tai, dịch, cháy | Trả phí trước mỗi mùa, có điều khoản loại trừ (III.3) |
| **Vay vốn** | HTX, ngân hàng, ứng trước thương lái (IV.5) | Lãi, thế chấp, hoặc bán nông sản giá thấp |
| **Bán tài sản** | Bán lại xe/máy/chuồng ở ~60% giá mua; bán đất | Mất năng lực sản xuất |
| **Làm thuê** | Đổi giờ công lấy tiền: 5 đồng/giờ, tối đa 5 giờ/ngày; chỉ mở khi tiền mặt dưới 50 đồng | Nông trại chỉ có người nhà trông coi trong lúc đó |

**Nợ quá hạn → tái cơ cấu (không có "game over", cũng không có quà):**

```
Trễ hạn           → lãi phạt (+50% lãi), cảnh báo trên Làng & Sổ sách
Trễ quá 1 mùa    → chủ nợ yêu cầu bán tài sản theo thứ tự: xe/máy → đất thế chấp
Vẫn không đủ     → Tái cơ cấu: giữ lại 3 ô đất + công cụ cơ bản,
                    xóa phần nợ còn lại, uy tín về 0, khóa vay 2 mùa,
                    sổ sách ghi "đã tái cơ cấu"
```

Sau tái cơ cấu, người chơi chỉ còn lại phần tối thiểu để gây dựng lại và phải chịu hậu quả kéo dài (uy tín về 0, bị khóa vay 2 mùa). Điều này khác hẳn việc được tặng vốn mới.

### III.8 Tích hợp với real-time và UI

- **Cảnh báo dạng toast** ("🌩️ Bão đến sau 1 ngày!", "📉 Giá cải sắp giảm vì cả vùng được mùa"). Sự kiện lớn **tự động tạm dừng** game để người chơi kịp phản ứng (có thể tắt).
- **Vắng mặt:** theo quy tắc ở I.6.5 và mức độ khó ở III.9; hạn nộp thuế, nợ, hợp đồng được lùi tương ứng.
- **Tab Làng:** bảng tin & dự báo thời tiết, thư thuế, bảo hiểm HTX, uy tín NPC (thương lái, thú y, thợ máy, cán bộ HTX, cán bộ tín dụng), tin giá cả vùng.
- Tất cả sinh theo seed + số ngày, nên load lại save không đổi sự kiện.

### III.9 Ba mức độ khó

| Thiết lập | Dễ thở | **Thực tế (mặc định)** | Khắc nghiệt |
| --- | --- | --- | --- |
| Tần suất sự kiện xấu | ×0.6 | ×1 | ×1.4 |
| Trần tổn thất mỗi sự kiện | 30% | 50% | 70% |
| Vật nuôi bỏ đói / bệnh không chữa | Không chết | Chết sau ≥ 6 ngày | Chết sau ≥ 4 ngày |
| Cây héo | Cứu được bằng nước trong 2 ngày | Cứu được trong 1 ngày, mất ~30% sản lượng | Héo là mất |
| Vắng mặt (offline) | Tối đa 8 giờ, không có sự kiện xấu | Tối đa 1 giờ, thiệt hại ×0.5 | Tối đa 30 phút, thiệt hại ×1 |
| Giờ công / ngày | 12 | 10 | 9 |
| Biên độ biến động giá | ±15% | ±25% | ±35% |
| Lãi vay | −20% | Chuẩn | +30% |
| Khi tái cơ cấu | Giữ 4 ô, được trả góp dài hơn | Giữ 3 ô + công cụ cơ bản | Giữ 2 ô + công cụ cơ bản |
| Thời gian cảnh báo | 2 ngày + gợi ý đối phó | 1–2 ngày | 0.5–1 ngày |
| Mùa cấm câu & giấy phép | Tắt | Bật | Bật |

Mọi mức độ đều **không có xã hội đen, không có quà hỗ trợ miễn phí**; khác biệt nằm ở sức ép và thời gian phản ứng.

### III.10 Cấu trúc dữ liệu mẫu

```json
{
  "hazard": {
    "id": "drought",
    "category": "nature",
    "unlock": { "min_day": 8 },
    "base_chance_per_day": 0.04,
    "duration_days": [2, 3],
    "warning_days": 1,
    "effects": [{ "target": "plot.moisture", "mult": 0.5 }],
    "counters": ["irrigation", "well", "water_tank", "drought_resistant_crop"],
    "loss_cap": { "easy": 0.3, "realistic": 0.5, "harsh": 0.7 },
    "insurable": true
  },
  "market_pressure": {
    "id": "single_buyer_dependence",
    "trigger": { "revenue_share_30d": 0.6 },
    "effect": { "price_mult": [0.85, 0.95], "duration_days": 7 },
    "counters": ["multi_channel", "contract", "cold_storage", "coop_sale"]
  }
}
```

## Phần IV. Tài chính & Thị trường mô phỏng

### IV.1 Vai trò & nguyên tắc

- **Thay cho hệ thống thưởng:** thay vì nhận XP và quà, người chơi nhận kết quả thật của quyết định: lãi, lỗ, nợ, uy tín.
- **Thị trường là đối thủ đọc được:** giá có quy luật (mùa vụ, thời tiết, cung vùng) nhưng không chắc chắn, người chơi nắm thông tin tốt thì có lợi thế.
- **Mọi khoản tiền ra/vào có nguồn gốc** và hiển thị trong sổ sách. Không có "tiền miễn phí".
- **Thay thế cho áp lực xã hội đen:** sự phụ thuộc, vị thế yếu và biến động giá tạo ra sức ép kinh tế (III.4).

### IV.2 Mô hình giá

```
Giá_thị_trường(hàng, ngày) = Giá_gốc × Đường_cong_mùa(hàng, ngày)
                             × Hệ_số_cung_vùng(hàng, ngày)
                             × Hệ_số_cầu_vùng(hàng, ngày)
                             × (1 + Nhiễu(ngày))
```

- **Đường cong mùa:** mỗi hàng có chu kỳ giá theo mùa (ví dụ lúa rẻ lúc gặt rộ, cao trước vụ; rau cải đắt sau bão).
- **Cung vùng (được mùa mất giá):** tính từ thời tiết cả vùng và diện tích mà các nông hộ NPC đang trồng mỗi loại.
  - Thời tiết thuận kéo dài → cung tăng lúc gặt rộ → giá giảm.
  - Hạn/bão → cung giảm → giá tăng.
  - **Mô hình mạng nhện:** giá cao mùa trước khiến diện tích NPC trồng loại đó tăng mùa sau, cung tăng, giá giảm. Người chơi có thể đọc xu hướng này từ bảng tin để đi trước đám đông.
- **Cầu vùng:** hội chợ, lễ hội, nhà máy chế biến mở trong vùng làm cầu một mặt hàng tăng trong một thời gian.
- **Nhiễu:** dao động ngẫu nhiên có xu hướng quay về trung bình, biên độ theo mức độ khó (III.9) và tính cách chợ (II.4).
- **Cầu cục bộ ở từng chợ:** mỗi đơn vị bán ra giảm 3% (sàn 60%), mỗi ngày hồi phục 10% (xem I.3.7).
- **Hệ số chất lượng (áp dụng chung, kể cả cá):** ⭐1 ×1, ⭐2 ×1.3, ⭐3 ×1.7.
- **Giá tại ruộng** (thương lái tới mua) bằng khoảng **75–90%** giá chợ, đổi lại không tốn vận tải.

**Thông tin cho người chơi (tab Chợ & Làng):**

- Biểu đồ giá lịch sử 14–28 ngày và mũi tên xu hướng từng mặt hàng.
- **Tin chợ** theo thời tiết vùng và diện tích NPC trồng.
- **Dự báo giá ngắn hạn** từ thương lái: chỉ có khi uy tín đủ cao, độ chính xác tăng theo uy tín (ví dụ uy tín 3: dự báo 3 ngày, sai số ±10%). Người chơi mới chỉ nhìn được giá hiện tại.

### IV.3 Kênh bán: chợ, thương lái, hợp đồng, đơn lẻ

| Kênh | Giá so với giá chợ | Điều kiện | Đánh đổi |
| --- | --- | --- | --- |
| **Bán ở chợ** | 100%, trừ bão hòa cục bộ | Hàng tới chợ đúng giờ họp | Tốn vận tải, chợ có tính cách riêng |
| **Thương lái tới ruộng** | 75–90% | Thương lái đang có mặt; mua cả lô | Rẻ nhưng không cần xe; dễ bị ép khi thế yếu |
| **Hợp đồng bao tiêu** | Giá cố định thỏa thuận | Ký trước; chất lượng tối thiểu; hạn giao | Phạt khi giao thiếu; giá cố định có thể thấp hơn thị trường lúc giao |
| **Đơn hàng lẻ** | +20–40% | Có hạn giao; nhận rồi mới có nghĩa vụ | Nhận mà không giao đúng hạn thì mất uy tín nhẹ |
| **Bán chung qua HTX** | +~5% (giá nhóm) | Thành viên HTX; hàng gom theo lịch | Phải giao theo lịch gom; phí HTX 2% |
| **Phiên chợ / lễ hội** | Cầu tăng 20–50% vài ngày | Theo lịch seed | Cạnh tranh hàng từ vùng khác; **không phát quà** |

**Thương lượng với thương lái:** khi thương lái chào giá, người chơi chọn **chấp nhận / trả giá một lần / từ chối**. Xác suất thành công của trả giá phụ thuộc uy tín và mức cầu. Hàng tươi sắp hỏng làm người chơi yếu thế hơn (III.4).

**Hợp đồng bao tiêu:**

- **Điều khoản:** mặt hàng, số lượng, chất lượng tối thiểu, giá/đơn vị, hạn giao (có thể chia nhiều đợt), mức phạt.
- **Giao thiếu:** phạt = tỉ lệ phạt (10–30%) × giá trị phần thiếu, kèm uy tín −1 (−2 với hợp đồng lớn).
- **Giao thừa:** phần thừa bán theo thị trường. **Chất lượng dưới chuẩn:** giảm giá hoặc từ chối đợt đó.
- **Ứng trước:** người mua có thể ứng trước tối đa 30% giá trị; không giao đủ thì hoàn lại và chịu phạt.
- **Giá cố định đóng vai trò bảo hiểm giá:** có lợi khi thị trường rớt, bất lợi khi thị trường lên.
- Số hợp đồng chạy đồng thời tăng theo uy tín.
- Hạn giao được lùi khi người chơi vắng mặt (I.6.5).

### IV.4 Uy tín

Mỗi NPC có chỉ số `uy tín` riêng (0–10): Bác Tư (thương lái), HTX, cán bộ tín dụng/ngân hàng, thú y, thợ máy, người mua lớn (thị trấn/thành phố).

- **Tăng khi:** giao đúng hạn, hàng đạt chất lượng, trả nợ đúng hạn, giao dịch đều đặn.
- **Giảm khi:** giao thiếu, hàng kém, trễ nợ, bỏ dở cam kết. **Không giảm** chỉ vì không giao dịch.
- **Tác dụng:** mở hợp đồng lớn và tuyến mới, giảm xác suất bị ép giá, tin giá sớm và dự báo, nâng hạn mức vay, giảm phí sửa xe/thuốc thú y.
- **Không thể mua hay nhận làm quà**; chỉ có được từ hành vi thật trong game.

### IV.5 Vay vốn & mua chịu

| Nguồn | Hạn mức | Lãi (mỗi mùa) | Thế chấp | Điều kiện | Ghi chú |
| --- | --- | --- | --- | --- | --- |
| **HTX** | 150, +75 mỗi điểm uy tín HTX | 2% | Không | Thành viên HTX (20 đồng) | Dễ vay, hạn mức nhỏ, trả theo mùa |
| **Ngân hàng** | Tới 40% giá trị đất sở hữu, +100 mỗi điểm uy tín tín dụng | 3% thả nổi (±1%/năm) hoặc 3.5% cố định | Đất đã mua | Uy tín tín dụng ≥ 1 | Hạn dài (tới 4 mùa), trả góp |
| **Ứng trước thương lái** | Tới 100/đợt | 0% lãi, nhưng bán lại nông sản cho họ với giá −20% khi giao | Không | Uy tín thương lái ≥ 1 | Nhanh, đắt, gắn với đầu ra |
| **Mua chịu đại lý** | Tới 150 vật tư | 6% | Không | Đã mua hàng ≥ 3 lần | Trả sau thu hoạch, lãi cao nhất |

- Lãi tính theo ngày; **trả sớm không phạt**.
- Nợ vượt 60% tài sản hiện hiển thị cảnh báo "rủi ro cao" trong sổ sách.
- Trả nợ trễ: lãi phạt rồi xử lý theo III.7 (bán tài sản, tái cơ cấu). **Không có xóa nợ miễn phí.**
- Vay đúng lúc để mua đất hoặc máy có thể rút ngắn hoàn vốn, vay quá sức khi gặp bão hay giá sụp có thể dẫn đến tái cơ cấu. Đây là bài toán cân nhắc chính của giai đoạn giữa game.

### IV.6 Chi phí, khấu hao & sổ sách

**Cấu trúc lãi/lỗ (mỗi mùa, mỗi năm):**

```
Doanh thu (bán chợ, hợp đồng, phụ phẩm)
− Giá vốn (giống, phân thuốc, thức ăn, nguyên liệu mua vào)
− Công thuê & lương
− Nhiên liệu, điện, bảo dưỡng
− Khấu hao máy móc, xe, công trình
− Thuế & phí, bảo hiểm
− Lãi vay
= Lợi nhuận ròng
```

- **Khấu hao:** xe, máy, công trình giảm giá trị 2–3%/mùa và giảm độ bền theo mức sử dụng. Bán lại ~60% giá mua khi còn mới, thấp dần theo độ bền. Độ bền dưới 30% thì dễ hỏng, cần sửa hoặc bảo dưỡng.
- **Báo cáo theo cây/vật nuôi/mùa:** lãi gộp, giờ công đã dùng, **lãi trên mỗi giờ công**, so với giá công thuê, để người chơi nhìn ra đâu là lãi thật, đâu chỉ là "bận mà không lời".
- **Dòng tiền & bảng cân đối đơn giản:** tiền mặt, tồn kho (theo giá thị trường), tài sản cố định, nợ, vốn.
- **Cảnh báo:** nợ sắp đến hạn, tồn kho sắp hỏng, hợp đồng sắp hết hạn, độ bền xe/máy thấp.
- **Mục tiêu tự đặt** và **thống kê dài hạn** (xem I.5). Không có điểm thưởng.

### IV.7 Giá đầu vào

- Giá giống, phân, thức ăn, nhiên liệu = giá gốc × đường cong mùa × sự kiện, biên độ ±10–25%. Giống rẻ trước vụ, đắt giữa vụ.
- Mua sớm tích kho tiết kiệm tiền nhưng chiếm vốn và chỗ kho; mua muộn có thể bị tăng giá.
- Thành viên HTX mua chung được giảm 5–8%.
- *(Tùy chọn, mức Khắc nghiệt)* chi phí đầu vào tăng nhẹ theo năm, nhanh hơn giá nông sản một chút, buộc người chơi nâng năng suất và tự sản xuất đầu vào (cám, phân hữu cơ).

### IV.8 Dữ liệu mẫu

```json
{
  "price_profile": {
    "item": "rice", "base": 6,
    "season_curve": { "spring": 1.05, "summer": 1.0, "autumn": 0.85, "winter": 1.1 },
    "regional_area_share": 0.18,
    "noise": { "amplitude": 0.08, "reversion": 0.15 }
  },
  "contract": {
    "id": "coop_rice_01", "buyer": "coop", "item": "rice",
    "qty": 60, "unit_price": 7, "min_quality": 2,
    "deadline_days": 10, "penalty_rate": 0.2,
    "advance_rate": 0.3, "reputation_on_fail": -1
  },
  "loan": {
    "id": "coop_loan", "lender": "coop",
    "limit": { "base": 150, "per_reputation": 75 },
    "interest_per_season": 0.02, "collateral": null,
    "term_seasons": 2, "early_repay_penalty": 0
  }
}
```

## Phần V. Câu cá & Ao cá

### V.1 Vai trò & nguyên tắc

- **Lấp khoảng trống:** mùa đông cây trồng ít, câu cá cho người chơi việc để làm và nguồn thu mới.
- **Tận dụng hệ thống sẵn:** cá là "nhóm hàng" mới đi theo chuỗi *Kho → Chế biến → Vận tải → Chợ*, ao cá hoạt động như chuồng trại.
- **Nhịp thư giãn nhưng có chi phí thật:** minigame ngắn (20–30 giây/lượt), dễ chơi bằng chuột hoặc chạm. Mỗi lượt tốn **0.25 giờ công**, nên câu cá cạnh tranh với việc đồng áng và là một lựa chọn thật, không phải việc miễn phí.
- **Thủ công trước, tự động sau:** câu tay là chính, bẫy cá/cần câu tự động là nâng cấp mua bằng tiền.

### V.2 Vùng nước

Sinh từ `world_seed` (liên kết lớp Đất & bản đồ): mỗi save có vị trí và loại nước khác nhau.

| Vùng nước | Cá đặc trưng | Đặc điểm | Điều kiện |
| --- | --- | --- | --- |
| Ao nhà | Cá nuôi (rô phi, chép, lóc) | Nuôi được, kiểm soát hoàn toàn | Đào ao 500 + 1 ô đất |
| Sông | Chép, trê, lóc | Cá đa dạng, bị ảnh hưởng lũ/hạn | Có sông trong bản đồ; giấy phép câu |
| Suối đồi | Cá hồi suối, cá chình | Cá hiếm, nước lạnh, ít cá | Có suối gần vùng đồi trong bản đồ |
| Hồ lớn | Koi, cá vàng, cá lớn | Cần thuyền, cá giá cao | Có hồ trong bản đồ + thuyền (900) |

Mỗi vùng có `độ sạch nước (0–100)` ảnh hưởng tỉ lệ cá cắn, chất lượng cá và bệnh.

### V.3 Câu cá (minigame)

**Luồng chơi:**

```
Chọn vùng → Chọn cần + mồi → Quăng (giữ & thả chuột/chạm)
→ Chờ cá cắn (3–10 giây, có phao rung) → Minigame kéo cá → Kết quả
```

**Minigame kéo cá:** có thanh dọc, một **vùng xanh** (cần câu) người chơi điều khiển bằng giữ chuột/chạm để đuổi theo **icon cá** đang di chuyển.

- Giữ icon cá trong vùng xanh đủ lâu thì lên cá; để tuột thanh thì cá chạy.
- Cá hiếm di chuyển nhanh, thất thường hơn; cá khỏe làm vùng xanh nhỏ lại.
- **Chất lượng ⭐1–3** dựa trên độ chính xác khi kéo.
- Có chế độ **"Câu nhàn"** (khi có cần câu tự động): không cần minigame, không tốn giờ công, nhưng cá chất lượng ⭐1 và tỉ lệ thấp.

**Yếu tố ảnh hưởng tỉ lệ cắn:**

| Yếu tố | Tác động |
| --- | --- |
| Mùa | Mỗi loài có mùa vụ, ngoài mùa thấp hơn |
| Buổi trong ngày (Sáng / Trưa / Chiều / Tối) | Sáng và Chiều cá cắn mạnh, Trưa nắng gắt giảm mạnh; mỗi buổi ~75 giây ở ×1 |
| Thời tiết | Mưa nhẹ tăng cắn, bão/nóng gắt giảm mạnh |
| Mồi | Mồi đúng sở thích loài tăng tỉ lệ và cho cá hiếm |
| Cần câu | Quyết định vùng xanh, độ bền dây, cá lớn nhất kéo được |
| Độ sạch nước | Nước đục: ít cá, chất lượng thấp |

**Công thức tỉ lệ cắn mẫu:**

```
P_cắn = Cơ_sở × H_mùa × H_buổi × H_thời_tiết × H_mồi × (Độ_sạch / 100)
```

### V.4 Dụng cụ

| Dụng cụ | Công dụng | Điều kiện / giá |
| --- | --- | --- |
| Cần tre | Cá nhỏ, vùng xanh nhỏ | Có sẵn khi bắt đầu |
| Cần sợi | Vùng xanh lớn hơn, kéo cá lớn hơn | Mua 120 |
| Cần carbon | Vùng xanh lớn, kéo được cá rất lớn | Mua 400 |
| Mồi giun, bánh mì, tôm nhỏ, mồi đặc biệt | Thu hút từng nhóm cá | Mua ở Cửa hàng (giá dao động) |
| **Bẫy cá / lưới** | Thụ động: đặt, vài ngày sau thu, ít cá | Mua 150, hao mòn theo thời gian |
| **Cần câu tự động** | Câu nhàn không tốn giờ công | Mua 600 |
| **Thuyền** | Mở hồ lớn, cá giá cao | Mua 900, cần bảo dưỡng |

### V.5 Bảng cá mẫu

| Cá | Vùng | Mùa | Buổi | Độ hiếm | Giá bán (⭐1) | Dụng cụ cần |
| --- | --- | --- | --- | --- | --- | --- |
| Cá rô phi | Ao/Sông | Hạ, Thu | Cả ngày | Thường | 10 | Cần tre |
| Cá chép | Ao/Sông | Xuân, Thu | Sáng, Chiều | Thường | 14 | Cần tre |
| Cá trê | Sông | Hạ | Tối | Thường | 12 | Cần tre |
| Cá lóc | Sông | Thu | Sáng | Ít gặp | 22 | Cần sợi |
| Cá hồi suối | Suối | Đông | Sáng | Hiếm | 35 | Cần sợi |
| Cá chình | Suối/Hồ | Thu | Tối | Hiếm | 80 | Cần sợi + mồi đặc biệt |
| Cá vàng | Hồ | Xuân | Sáng | Rất hiếm | 100 | Thuyền + cần carbon |
| Cá koi | Hồ | Mọi mùa | Chiều | Rất hiếm | 150 | Thuyền + cần carbon |

- Giá nhân theo chất lượng, dùng chung hệ số toàn game (IV.2): ⭐1 ×1, ⭐2 ×1.3, ⭐3 ×1.7. Giá thực tế còn chịu mô hình giá thị trường.
- Mỗi cá có **kích thước ngẫu nhiên**; kích thước càng gần kỷ lục càng được ghi vào sổ cá.

### V.6 Ao cá (nuôi cá)

Hoạt động như chuồng trại: thả cá giống, cho ăn, chờ lớn, thu hoạch, và tốn giờ công mỗi ngày.

| Cá giống | Giá giống | Chu kỳ | Giá bán | Sức chứa ao nhỏ | Lãi/con ước tính (mua thức ăn / dùng cám) |
| --- | --- | --- | --- | --- | --- |
| Rô phi | 5/con | 7 ngày | 10 | 30 | ~2.4 / ~5 |
| Chép | 8/con | 8 ngày | 14 | 24 | ~3 / ~6 |
| Cá lóc | 15/con | 10 ngày | 22 | 15 | ~3.3 / ~7 |

- **Cho ăn:** 1 đơn vị thức ăn (3đ) nuôi 8 con/ngày, hoặc dùng **cám lúa tự có** (phụ phẩm từ xay xát, I.3.5) để lãi gần gấp đôi. Bỏ đói thì cá chậm lớn.
- **Độ sạch nước:** giảm theo mật độ cá và thức ăn dư; tăng nhờ thay nước, cây thủy sinh, máy sục khí.

```
Δ Độ_sạch/ngày = −0.5 × (Số_cá / Sức_chứa) − Thức_ăn_dư + Xử_lý_nước
```

- **Bệnh cá:** khi độ sạch < 40 dễ bệnh, giảm tăng trưởng và lan trong ao. Ở mức "Thực tế" cá bệnh không chữa lâu sẽ chết dần; ở "Dễ thở" chỉ chậm lớn. Chữa bằng thuốc hoặc thay nước (khớp nhóm *Dịch bệnh*).
- **Nâng cấp:** mở rộng ao (+sức chứa), máy sục khí, ao thứ hai.
- **Kết hợp lúa–cá:** đặt ao cạnh ruộng lúa giảm lượng nước tưới ~20%, cá cho phân tự nhiên (+độ phì). Khuyến khích người chơi bố trí khéo.

### V.7 Chế biến, kho, vận tải, chợ

- **Chế biến:** cá khô (3 ngày, hạn dài), cá hun khói, chả cá, mắm cá, súp cá (kết hợp rau củ). Thành phẩm giá gấp 1.5–3 lần, có hao hụt, tốn công và nhiên liệu.
- **Kho:** cá tươi **hạn sử dụng ngắn (1–2 ngày)**, phải bán/chế biến sớm hoặc để kho lạnh. Khớp cơ chế hàng tươi sẵn có.
- **Vận tải:** cá tươi cần **xe lạnh** khi đi chợ xa, nếu không bị giảm chất lượng.
- **Chợ:** cá thuộc nhóm "hàng tươi". Chợ có tính cách *Chuộng hàng tươi* trả cá cao, chợ kén chất lượng chỉ lấy cá ⭐2 trở lên. Hợp đồng/đơn hàng có thể yêu cầu "10 cá chép ⭐2" (IV.3).

### V.8 Sổ cá & sự kiện

- **Sổ cá (album):** ghi mỗi loài đã bắt, kích thước lớn nhất, số lượng. Đây là **hồ sơ để xem lại**, **không tặng vật phẩm hay tiền** khi đạt mốc.
- **Phiên chợ cá / hội chợ:** cầu cá tăng vài ngày, giá cao hơn bình thường. Không có thi đấu lấy quà.
- **Cá quý hiếm:** mỗi save có 1 loài sinh theo seed, xuất hiện rất hiếm ở 1 vùng nước, gợi ý bằng tin đồn trong làng. Giá bán cao nhưng không có thưởng đặc biệt.
- **Hợp đồng theo mùa:** nhà hàng/HTX có thể ký hợp đồng mua cá theo số lượng và chất lượng (IV.3).

### V.9 Chướng ngại liên quan

| Chướng ngại | Tác động tới cá |
| --- | --- |
| Hạn hán | Ao/sông cạn, độ sạch giảm, cá bắt khó hơn |
| Bão / Lũ | Cá tràn ra khỏi ao, vùng sông đục |
| Ô nhiễm nước | Giảm độ sạch toàn vùng, cần xử lý |
| Cá bệnh | Giảm tăng trưởng, lan trong ao, có thể chết |
| Trộm | Mất cá trong ao ban đêm (phòng bằng rào, chó, đèn) |
| Thuế / giấy phép | Phí giấy phép câu ở sông công cộng, mùa cấm câu (cá sinh sản); mùa cấm có thể tắt ở mức "Dễ thở" |

### V.10 Dữ liệu mẫu

```json
{
  "fish": {
    "id": "carp", "name": "Cá chép", "category": "fresh_fish",
    "waters": ["pond", "river"], "seasons": ["spring", "autumn"],
    "time_of_day": ["morning", "afternoon"], "rarity": "common",
    "base_price": 14, "shelf_life_days": 2, "min_gear": "bamboo_rod",
    "bait": ["worm", "bread"], "size_range_cm": [20, 60],
    "minigame": { "speed": 1.0, "erratic": 0.2 }, "labor_per_cast": 0.25
  },
  "water_zone": { "type": "river", "cleanliness": 80, "fish_pool": ["carp", "catfish", "snakehead"] }
}
```

### V.11 Chuẩn bị chỗ cắm (làm từ MVP, không cần code tính năng)

- Vật phẩm có trường `category` (thêm `fresh_fish` là xong).
- "Ô đất" đổi tên khái niệm thành **"Vùng"** (đất hoặc nước), seed sinh luôn sông/ao/hồ.
- Chợ và kho đã hỗ trợ hàng tươi, hạn sử dụng.
- Tab **Đất & Nước** chứa trồng trọt, ao cá và câu cá.
- Giờ công có sẵn trường `labor_per_action` cho mọi hoạt động.

## Phần VI. Lộ trình tổng hợp & việc cần làm tiếp

### VI.1 Lộ trình

Nguyên tắc sắp xếp: **chiều sâu trước chiều rộng.** MVP ít cây, ít hệ thống nhưng phải có đủ ba thứ làm game cuốn từ đầu là **nhịp độ** (giờ công, tua thông minh), **quyết định thật** (giá mô phỏng, hai chợ, vay vốn) và **thông tin để quyết định** (thời tiết, dự báo, biểu đồ giá). Ao cá và câu cá dời xuống cuối.

| Giai đoạn | Nội dung |
| --- | --- |
| **MVP** | Đất & Nước (chỉ trồng trọt): rau cải, khoai lang, cà chua, ngô. Cửa hàng, Kho (hạn sử dụng). Chợ làng + chợ huyện (đi bằng xe thuê hoặc nhờ chuyến Bác Tư). Ngày real-time, 4 buổi, **giờ công, tua thông minh, thao tác hàng loạt**, lưu local. **Thời tiết + dự báo, độ ẩm đất. Giá mô phỏng cơ bản** (đường cong mùa + cung vùng đơn giản + nhiễu) kèm biểu đồ giá; thương lái Bác Tư. Thuê/mua đất, thuê công nhật, **vay HTX**. Sổ sách cơ bản (lãi/lỗ). RNG có seed, loại đất, 3 hồ sơ khởi đầu, validator + bot. Chuẩn bị chỗ cắm: `category`, "Vùng", `labor_per_action` |
| **Phase 2** | Chuồng trại (gà, vịt), Chế biến, Vận tải đầy đủ (xe bò, thuê xe, sự cố vận chuyển), 4 mùa đầy đủ + lúa nước, dâu tây. Tính cách chợ + giờ họp chợ. Thiên tai (hạn, bão), dịch vật nuôi, cảnh báo & tự tạm dừng. **Hợp đồng bao tiêu, vay ngân hàng, mua chịu, công cố định, bảo dưỡng & khấu hao.** Ba mức độ khó |
| **Phase 3** | **Tab Làng đầy đủ + uy tín NPC**, bảo hiểm HTX, thuế & phí, trộm vặt, **áp lực thị trường** (ép giá, giá sụp, giá đầu vào), **tái cơ cấu**. Bò, heo, kho lạnh, xe tải/xe lạnh. **Ao cá** |
| **Phase 4** | Chợ thành phố + hợp đồng lớn, giống tốt/cây quý, chuỗi sự kiện NPC, bối cảnh năm, seed chia sẻ, chế độ tự do (sandbox). **Minigame câu cá**, sổ cá, thuyền & hồ lớn, cá quý hiếm. Tinh chỉnh cân bằng ba mức độ khó |

### VI.2 Chỉ số kiểm nghiệm nhịp độ

Dùng khi playtest MVP để biết "chậm và nhạt" đã được sửa chưa:

| Chỉ số | Mục tiêu |
| --- | --- |
| Thời gian tới lần thu hoạch đầu | ≤ 3 phút chơi hiệu dụng |
| Thời gian tới quyết định lớn đầu tiên | ≤ 10 phút |
| Tỉ lệ thời gian "chờ không có việc hữu ích" (≥ 20 giây thật) | < 25% trong 30 phút đầu |
| Số quyết định có đánh đổi mỗi ngày game (xếp giờ công, bán, mua, vay) | ≥ 3 |
| Thời gian ở trạng thái tua thông minh | Theo dõi; nếu > 60% thì ngày quá trống, cần thêm việc hoặc rút ngắn chu kỳ |
| Tỉ lệ tái cơ cấu trong 1 giờ đầu ở mức "Thực tế" | < 5% số seed (kiểm bằng bot) |
| Tỉ lệ diện tích dồn vào 1 loại cây ở chiến lược tối ưu | ≤ 60% (nếu cao hơn thì cân bằng lại) |
| Thời gian hoàn vốn các đầu tư | Nằm trong khung ở I.4 |

### VI.3 Việc cần làm tiếp

1. **Chốt các giả định của bản 2:** (a) "Thực tế" làm mặc định kèm 2 mức độ khó, hay chỉ có một bản chân thực duy nhất; (b) hình ảnh giữ chibi/cute hay chuyển bán thực tế; (c) Việt hóa toàn bộ cây trồng/bối cảnh hay giữ trung tính; (d) giới hạn vắng mặt 1 giờ thật đã hợp lý chưa.
2. Chốt engine (Phaser hay DOM thuần) và art style cụ thể.
3. Làm prototype MVP mới: 6–8 ô đất, giờ công, tua thông minh, thời tiết + dự báo, giá mô phỏng + biểu đồ, 2 chợ, vay HTX, sổ sách cơ bản.
4. Lập **bảng cân bằng số liệu toàn game** (giá, chi phí, xác suất sự kiện, thuế, lãi vay, hợp đồng, phòng vệ) và viết **bot mô phỏng** chạy hàng loạt seed để bắt lỗi cân bằng trước khi playtest.
5. Playtest theo các chỉ số ở VI.2, chỉnh nhịp độ và số liệu, rồi mới mở rộng sang Phase 2.
