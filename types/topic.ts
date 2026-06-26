export type AgeGroup = '3-4' | '5-6' | '7-8' | '9-10'

export type Topic =
  // 3-4 tuổi
  | 'counting'        // đếm số 1-10
  | 'shapes'          // nhận diện hình khối
  | 'quantityMatch'   // ghép số với số lượng (dragDrop)
  | 'comparison'      // so sánh nhiều/ít (also 5-6)
  | 'sizeOrdering'    // sắp xếp theo kích thước (ordering)
  | 'memoryMatch'     // lật thẻ tìm cặp (memoryFlip)
  | 'patternSeq'      // nhận diện quy luật dãy (also 5-6)
  | 'oddOneOut'       // tìm vật khác loại (also 5-6)
  | 'subitizing'      // nhận diện nhanh số lượng
  | 'colorRecognition' // nhận diện màu sắc
  | 'soundMatching'   // ghép âm thanh với hình ảnh
  // 5-6 tuổi
  | 'addition'        // cộng ≤10 (also 7-8)
  | 'subtraction'     // trừ ≤10 (also 7-8)
  | 'sequence'        // điền số còn thiếu
  | 'wordProblem'     // cộng trừ qua câu chuyện (also 7-8)
  | 'balanceScale'    // cân bằng phép tính
  | 'gridPattern'     // điền ô lưới (also 7-8)
  | 'logicSort'       // phân loại vật vào nhóm (dragDrop, also 7-8)
  // 7-8 tuổi
  | 'multiplication'  // bảng cửu chương
  | 'division'        // phép chia cơ bản
  | 'clock'           // đọc đồng hồ kim
  | 'measurement'     // đo lường trực quan
  | 'money'           // mua sắm giả lập
  | 'codeSequence'    // xếp bước đúng thứ tự (ordering)
  // 9-10 tuổi
  | 'fractions'       // nhận diện phân số
  | 'fractionCompare' // so sánh phân số
  | 'geometry'        // chu vi, diện tích
  | 'analogyThinking' // tư duy tương tự (A:B = C:?)

export type GameMode =
  | 'standard'      // Q&A flow thông thường
  | 'numberRace'    // nhân vật chạy đua theo kết quả đúng
  | 'puzzleReveal'  // mỗi câu đúng mở 1 mảnh ghép
  | 'escapeRoom'    // mỗi câu đúng mở 1 khóa số
  | 'spinWheel'     // quay vòng random ra phép tính
  | 'combo'         // chuỗi đúng liên tiếp mở danh hiệu

export interface TopicMeta {
  id: Topic
  labelVi: string
  emoji: string
  ageGroups: AgeGroup[]
}

export const TOPIC_META: TopicMeta[] = [
  // 3-4 tuổi
  { id: 'counting',       labelVi: 'Đếm số',          emoji: '🔢', ageGroups: ['3-4', '5-6'] },
  { id: 'shapes',         labelVi: 'Hình khối',        emoji: '🔷', ageGroups: ['3-4'] },
  { id: 'quantityMatch',  labelVi: 'Ghép số lượng',   emoji: '🔗', ageGroups: ['3-4'] },
  { id: 'comparison',     labelVi: 'So sánh',          emoji: '⚖️', ageGroups: ['3-4', '5-6'] },
  { id: 'sizeOrdering',   labelVi: 'Sắp xếp',         emoji: '📐', ageGroups: ['3-4'] },
  { id: 'memoryMatch',    labelVi: 'Ghi nhớ',          emoji: '🧠', ageGroups: ['3-4', '5-6'] },
  { id: 'patternSeq',     labelVi: 'Quy luật dãy',    emoji: '🔄', ageGroups: ['3-4', '5-6'] },
  { id: 'oddOneOut',      labelVi: 'Vật khác loại',   emoji: '❓', ageGroups: ['3-4', '5-6'] },
  { id: 'subitizing',     labelVi: 'Nhận nhanh số',   emoji: '⚡', ageGroups: ['3-4', '5-6'] },
  { id: 'colorRecognition', labelVi: 'Nhận diện màu',  emoji: '🎨', ageGroups: ['3-4'] },
  { id: 'soundMatching',  labelVi: 'Ghép âm thanh',   emoji: '🔊', ageGroups: ['3-4'] },
  // 5-6 tuổi
  { id: 'addition',       labelVi: 'Phép cộng',        emoji: '➕', ageGroups: ['5-6', '7-8'] },
  { id: 'subtraction',    labelVi: 'Phép trừ',         emoji: '➖', ageGroups: ['5-6', '7-8'] },
  { id: 'sequence',       labelVi: 'Dãy số',           emoji: '🔗', ageGroups: ['5-6'] },
  { id: 'wordProblem',    labelVi: 'Toán đố',          emoji: '📖', ageGroups: ['5-6', '7-8'] },
  { id: 'balanceScale',   labelVi: 'Cân bằng',         emoji: '⚖️', ageGroups: ['5-6'] },
  { id: 'gridPattern',    labelVi: 'Lưới số',         emoji: '🔲', ageGroups: ['5-6', '7-8'] },
  { id: 'logicSort',      labelVi: 'Phân loại',       emoji: '🏷️', ageGroups: ['5-6', '7-8'] },
  // 7-8 tuổi
  { id: 'multiplication', labelVi: 'Phép nhân',        emoji: '✖️', ageGroups: ['7-8', '9-10'] },
  { id: 'division',       labelVi: 'Phép chia',        emoji: '➗', ageGroups: ['7-8', '9-10'] },
  { id: 'clock',          labelVi: 'Đồng hồ',          emoji: '🕐', ageGroups: ['7-8'] },
  { id: 'measurement',    labelVi: 'Đo lường',         emoji: '📏', ageGroups: ['7-8'] },
  { id: 'money',          labelVi: 'Tiền tệ',          emoji: '💰', ageGroups: ['7-8'] },
  { id: 'codeSequence',   labelVi: 'Thứ tự bước',     emoji: '1️⃣', ageGroups: ['7-8', '9-10'] },
  // 9-10 tuổi
  { id: 'fractions',      labelVi: 'Phân số',          emoji: '🍕', ageGroups: ['9-10'] },
  { id: 'fractionCompare',labelVi: 'So sánh phân số',  emoji: '🔢', ageGroups: ['9-10'] },
  { id: 'geometry',       labelVi: 'Hình học',         emoji: '📐', ageGroups: ['9-10'] },
  { id: 'analogyThinking',labelVi: 'Tư duy tương tự',  emoji: '🧩', ageGroups: ['9-10'] },
]
