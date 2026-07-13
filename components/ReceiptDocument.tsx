import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";

// Кирилл үсэгт зориулж локал Roboto-г бүртгэнэ (public/fonts).
// Браузер дээр рендэрлэгддэг тул relative URL нь сайтын origin-оос уншигдана.
Font.register({
  family: "Roboto",
  src: "/fonts/Roboto-Regular.ttf",
});
Font.register({
  family: "Roboto-Bold",
  src: "/fonts/Roboto-Bold.ttf",
});

const BRAND = "#b45309"; // amber-700 — сайтын үндсэн өнгө
const MUTED = "#6b7280";

const styles = StyleSheet.create({
  page: {
    padding: 48,
    fontFamily: "Roboto",
    fontSize: 10.5,
    color: "#1f2937",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: BRAND,
    paddingBottom: 16,
    marginBottom: 24,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 64,
    height: 64,
  },
  brandTitle: {
    fontSize: 16,
    fontFamily: "Roboto-Bold",
    color: BRAND,
  },
  brandSub: {
    fontSize: 9,
    color: MUTED,
    marginTop: 2,
  },
  receiptTag: {
    fontSize: 13,
    fontFamily: "Roboto-Bold",
    textAlign: "right",
  },
  receiptMeta: {
    fontSize: 9,
    color: MUTED,
    textAlign: "right",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontFamily: "Roboto-Bold",
    color: MUTED,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 4,
  },
  donorName: {
    fontSize: 13,
    fontFamily: "Roboto-Bold",
  },
  table: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableRowLast: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tableHeader: {
    backgroundColor: "#fffbeb",
    fontFamily: "Roboto-Bold",
  },
  col1: { width: "72%" },
  col2: { width: "28%", textAlign: "right" },
  totalSection: {
    marginTop: 14,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalText: {
    fontSize: 13,
    fontFamily: "Roboto-Bold",
    color: BRAND,
  },
  statement: {
    marginTop: 28,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    fontSize: 9,
    color: "#374151",
  },
  thanks: {
    marginTop: 24,
    fontSize: 11,
    fontFamily: "Roboto-Bold",
  },
  footer: {
    position: "absolute",
    left: 48,
    right: 48,
    bottom: 32,
    fontSize: 8,
    color: MUTED,
    textAlign: "center",
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    paddingTop: 8,
  },
});

export interface ReceiptDonation {
  id: string;
  type: string; // money | goods | service
  name: string;
  amount: number | null;
  method: string | null;
  description: string | null;
  donatedAt: string | null;
  issuedAt: string;
}

const usd = (n: number) =>
  "$" + n.toLocaleString("en-US", { maximumFractionDigits: 2 });

function lineDescription(d: ReceiptDonation): string {
  if (d.type === "money") {
    return (
      "Charitable cash contribution / Мөнгөн хандив" +
      (d.method ? ` (${d.method})` : "")
    );
  }
  if (d.type === "goods") {
    return `In-kind contribution / Эд зүйлсийн хандив: ${d.description ?? ""}`;
  }
  return `Contributed services / Үйл ажиллагааны дэмжлэг: ${d.description ?? ""}`;
}

function taxStatement(d: ReceiptDonation): string {
  const base =
    "Mongolian Heritage Center is a tax-exempt organization described in Section 501(c)(3) of the Internal Revenue Code (EIN 93-3162554). No goods or services were provided in exchange for this contribution.";
  if (d.type === "money") {
    return base + " Please retain this receipt for your tax records.";
  }
  if (d.type === "goods") {
    return (
      base +
      " The organization has not assigned a value to the donated property; valuation is the responsibility of the donor (donor-estimated values shown are not certified by the organization)."
    );
  }
  return "This letter acknowledges services generously contributed to Mongolian Heritage Center, a tax-exempt organization described in Section 501(c)(3) of the Internal Revenue Code (EIN 93-3162554). Under IRS rules, the value of donated services is generally not tax-deductible.";
}

export const ReceiptDocument = ({ data }: { data: ReceiptDonation }) => {
  const showAmount = data.type === "money" && data.amount != null;
  const estValue = data.type !== "money" && data.amount != null;

  return (
    <Document
      title={`Donation receipt ${data.id.slice(-8).toUpperCase()}`}
      author="Mongolian Heritage Center"
    >
      <Page size="LETTER" style={styles.page}>
        {/* Толгой */}
        <View style={styles.header}>
          <View style={styles.brandRow}>
            {/* eslint-disable-next-line jsx-a11y/alt-text -- react-pdf Image, DOM биш */}
            <Image style={styles.logo} src="/logo-receipt.png" />
            <View>
              <Text style={styles.brandTitle}>MONGOLIAN HERITAGE CENTER</Text>
              <Text style={styles.brandSub}>Монгол Өв Соёлын Төв</Text>
              <Text style={styles.brandSub}>
                501(c)(3) Nonprofit Organization · EIN: 93-3162554
              </Text>
              <Text style={styles.brandSub}>
                1301 S Wolf Road, Prospect Heights, IL 60070, USA
              </Text>
              <Text style={styles.brandSub}>
                info@mongolianheritagecenter.org · +1 (872) 231-0808
              </Text>
            </View>
          </View>
          <View>
            <Text style={styles.receiptTag}>DONATION RECEIPT</Text>
            <Text style={styles.receiptMeta}>ХАНДИВЫН БАРИМТ</Text>
            <Text style={styles.receiptMeta}>
              Receipt No: {data.id.slice(-8).toUpperCase()}
            </Text>
            {data.donatedAt ? (
              <Text style={styles.receiptMeta}>
                Donation date / Хандивласан: {data.donatedAt}
              </Text>
            ) : null}
            <Text style={styles.receiptMeta}>
              Issued / Олгосон: {data.issuedAt}
            </Text>
          </View>
        </View>

        {/* Хандивлагч */}
        <View>
          <Text style={styles.sectionTitle}>
            Received from / Хандивлагч
          </Text>
          <Text style={styles.donorName}>{data.name}</Text>
        </View>

        {/* Хандивын мэдээлэл */}
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={styles.col1}>Description / Тайлбар</Text>
            <Text style={styles.col2}>Amount / Дүн</Text>
          </View>
          <View style={styles.tableRowLast}>
            <Text style={styles.col1}>{lineDescription(data)}</Text>
            <Text style={styles.col2}>
              {showAmount
                ? usd(data.amount as number)
                : estValue
                  ? `${usd(data.amount as number)}*`
                  : "—"}
            </Text>
          </View>
        </View>

        {showAmount ? (
          <View style={styles.totalSection}>
            <Text style={styles.totalText}>
              Total / Нийт дүн: {usd(data.amount as number)}
            </Text>
          </View>
        ) : null}
        {estValue ? (
          <Text style={{ marginTop: 8, fontSize: 8.5, color: MUTED }}>
            * Donor-estimated value / Хандивлагчийн тооцоолсон үнэлгээ
          </Text>
        ) : null}

        {/* Татварын мэдэгдэл */}
        <Text style={styles.statement}>{taxStatement(data)}</Text>

        <Text style={styles.thanks}>
          Танд чин сэтгэлээсээ талархал илэрхийлье! Таны хандив монгол хэл,
          соёлоо хойч үедээ өвлүүлэхэд үнэтэй хувь нэмэр болно.
        </Text>

        <Text style={styles.footer}>
          Mongolian Heritage Center · mongolianheritagecenter.org · Receipt{" "}
          {data.id.slice(-8).toUpperCase()}
        </Text>
      </Page>
    </Document>
  );
};
