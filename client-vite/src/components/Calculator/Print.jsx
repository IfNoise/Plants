import { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import PropTypes from "prop-types";
import { Button, Dialog, DialogActions } from "@mui/material";

const PrintConcentrate = forwardRef(({ concentrate, volume }, ref) => {
  const { name, description, fertilizers, content } = concentrate;
  return (
    <div ref={ref} style={{ padding: "10px" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "5px" }}>{name}</h1>
      <p style={{ marginBottom: "10px" }}>{description}</p>
      <h2 style={{ fontSize: "20px", marginBottom: "5px" }}>Elements</h2>
      <div style={{ display: "flex" }}>
        <table style={{ borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  textAlign: "left",
                }}
              >
                Element
              </th>
              {content.map((c, i) => (
                <td
                  key={i}
                  style={{ border: "1px solid #ddd", padding: "5px" }}
                >
                  {c.element}
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <th
                style={{
                  border: "1px solid #ddd",
                  padding: "5px",
                  textAlign: "left",
                }}
              >
                ppm
              </th>
              {content.map((c, i) => (
                <td
                  key={i}
                  style={{ border: "1px solid #ddd", padding: "5px" }}
                >
                  {c.concentration < 0.01
                    ? c.concentration.toFixed(4)
                    : c.concentration.toFixed(2)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <h2 style={{ fontSize: "20px", marginBottom: "5px" }}>Fertilizers</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "5px",
                textAlign: "left",
              }}
            >
              Nutrient
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "5px",
                textAlign: "left",
              }}
            >
              Mass per 1L
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "5px",
                textAlign: "left",
              }}
            >
              Mass per {volume}L
            </th>
          </tr>
        </thead>
        <tbody>
          {fertilizers.map((f, i) => (
            <tr key={i}>
              <td style={{ border: "1px solid #ddd", padding: "5px" }}>
                {f.fertilizer.name}
              </td>
              <td style={{ border: "1px solid #ddd", padding: "5px" }}>
                {f.concentration}g
              </td>
              <td style={{ border: "1px solid #ddd", padding: "5px" }}>
                {(f.concentration * volume).toFixed(0)}g
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
});
PrintConcentrate.displayName = "PrintConcentrate";
PrintConcentrate.propTypes = {
  concentrate: PropTypes.object.isRequired,
  volume: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

// Компонент для печати многих концентратов
const PrintAllConcentrates = forwardRef(({ concentrates, volume }, ref) => {
  return (
    <div ref={ref} style={{ padding: "10px" }}>
      {concentrates.map((conc, index) => (
        <div
          key={index}
          style={{
            marginBottom: "5px",
            pageBreakInside: "avoid",
            //pageBreakAfter: "always",
          }}
        >
          <PrintConcentrate concentrate={conc} volume={volume} />
        </div>
      ))}
    </div>
  );
});

PrintAllConcentrates.displayName = "PrintAllConcentrates";
PrintAllConcentrates.propTypes = {
  concentrates: PropTypes.array.isRequired,
  volume: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function PrintConcentrateDialog({ open, onClose, concentrate, volume }) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    ignoreGlobalStyles: true,
  });
  return (
    <Dialog open={open} onClose={onClose}>
      <PrintConcentrate
        ref={componentRef}
        concentrate={concentrate}
        volume={volume}
      />
      <DialogActions>
        <Button onClick={handlePrint}>Print</Button>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
PrintConcentrateDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  concentrate: PropTypes.object.isRequired,
  volume: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

function PrintAllConcentratesDialog({ open, onClose, concentrates, volume }) {
  const allRef = useRef(null);

  // Регистрируем хук для печати
  const handlePrint = useReactToPrint({
    // В старых версиях библиотеки можно использовать contentRef
    // Но если у вас есть опция content, используйте:
    // content: () => allRef.current,
    contentRef: allRef,
    documentTitle: "All Concentrates",
    ignoreGlobalStyles: true, // при необходимости
  });

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Компонент со всеми концентратами */}
      <PrintAllConcentrates
        ref={allRef}
        concentrates={concentrates}
        volume={volume}
      />
      <div style={{ padding: "10px" }}>
        <Button onClick={handlePrint}>Print All</Button>
        <Button onClick={onClose}>Close</Button>
      </div>
    </Dialog>
  );
}
PrintAllConcentratesDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  concentrates: PropTypes.array.isRequired,
  volume: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export { PrintConcentrateDialog, PrintAllConcentratesDialog };
