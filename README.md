# habatack-pronavi-redesign
Habatack - ProNavi Website Redesign for Hackathon

---

## 🎯 プロジェクト概要
本リポジトリは、現行の **ProNavi公式サイト** を
「UI/UX・デザイン・訴求力」を高めた新デザインでリニューアルするための
ハッカソン制作プロジェクトです。

**制作期間:** 1ヶ月  
**チーム名:** Habatack  
**使用技術:** HTML / CSS / JavaScript / jQuery  
**目的:** 無料カウンセリング申込（CV）の向上と信頼感・挑戦意欲を喚起するデザイン

---

## 🧱 開発環境
- VSCode + Live Server  
- GitHub + Live Share（共同編集）  
- Chrome（PC/スマホ両対応）

---

## 🧩 ディレクトリ構成
src/
├── index.html
├── assets/
│ ├── css/
│ │ └── style.css
│ ├── js/
│ │ └── main.js
│ └── img/
docs/
design/


---

## 🌿 ブランチ運用ルール
| ブランチ | 用途 |
|-----------|------|
| `main` | 安定版（発表用） |
| `dev` | 開発統合ブランチ |
| `feature/〇〇` | 各メンバー作業用（例：`feature/header`） |

- `feature/`：新しい機能やセクションを追加するとき
- `fix/`：バグ修正
- `hotfix/`：緊急修正

---

## 👥 チームメンバー
- **Riku Takiguchi**
- **メンバーA**
- **メンバーB**

---

## 💡 ルールメモ
- 各作業は `feature/` ブランチから `dev` に Pull Request  
- コミットメッセージは英語ベース推奨（例：`feat: add header section`）  
- main への直接pushは禁止（保護ルールあり）  

### 🔖 コミットメッセージのprefix一覧
| prefix | 用途 | 例 |
|---------|------|----|
| `feat:` | 新しい機能・セクションの追加 | `feat: add hero section` |
| `fix:` | バグ修正・動作不具合の修正 | `fix: correct footer layout` |
| `docs:` | ドキュメント（READMEなど）の更新 | `docs: update project rules` |
| `style:` | 見た目・フォーマットの調整（機能変更なし） | `style: adjust button spacing` |
| `refactor:` | コードのリファクタリング（機能は同じ） | `refactor: simplify header script` |
| `chore:` | 設定やビルド関連などの雑務 | `chore: update .gitignore` |
| `test:` | テスト関連の追加・修正 | `test: add form validation test` |

💬 例：
```bash
git commit -m "feat: add navigation bar"



---
w
## 📝 今後のTODO
<!-- 以下内容は仮置き -->
- [ ] トップページデザイン反映  
- [ ] スマホ対応（レスポンシブ）  
- [ ] 受講者の声セクション追加  
- [ ] カウンセリング申込フォーム実装  
