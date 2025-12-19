import { useDispatch } from "react-redux";
import { addNote } from "../../store/newActionSlice";
import { Box, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Компонент для выбора дефицита элементов
const Deficiencies = ({ onChange }) => {
  const deficiencies = [
    { value: "N", label: "Nitrogen (N) - Азот" },
    { value: "P", label: "Phosphorus (P) - Фосфор" },
    { value: "K", label: "Potassium (K) - Калий" },
    { value: "Mg", label: "Magnesium (Mg) - Магний" },
    { value: "Ca", label: "Calcium (Ca) - Кальций" },
    { value: "Fe", label: "Iron (Fe) - Железо" },
    { value: "S", label: "Sulfur (S) - Сера" },
    { value: "Zn", label: "Zinc (Zn) - Цинк" },
    { value: "Mn", label: "Manganese (Mn) - Марганец" },
    { value: "B", label: "Boron (B) - Бор" },
    { value: "Cu", label: "Copper (Cu) - Медь" },
    { value: "Mo", label: "Molybdenum (Mo) - Молибден" }
  ];
  const [value, setValue] = useState("");
  
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    onChange((prev) => ({ 
      ...prev, 
      variant: "Deficiency", 
      item: selectedValue 
    }));
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 120, mt: 2 }} fullWidth>
      <InputLabel id="deficiency-label">Дефицит элемента</InputLabel>
      <Select
        labelId="deficiency-label"
        value={value}
        label="Дефицит элемента"
        onChange={handleChange}
      >
        {deficiencies.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Компонент для выбора насекомых-вредителей
const Insects = ({ onChange }) => {
  const insects = [
    { value: "spider_mite", label: "Паутинный клещ (Spider Mite)" },
    { value: "thrips", label: "Трипсы (Thrips)" },
    { value: "fungus_gnat", label: "Сциариды (Fungus Gnat)" },
    { value: "aphids", label: "Тля (Aphids)" },
    { value: "whitefly", label: "Белокрылка (Whitefly)" },
    { value: "caterpillar", label: "Гусеницы (Caterpillar)" },
    { value: "leaf_miner", label: "Минирующая моль (Leaf Miner)" }
  ];
  const [value, setValue] = useState("");
  
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    onChange((prev) => ({ 
      ...prev, 
      variant: "Insects", 
      item: selectedValue 
    }));
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 120, mt: 2 }} fullWidth>
      <InputLabel id="insect-label">Тип вредителя</InputLabel>
      <Select
        labelId="insect-label"
        value={value}
        label="Тип вредителя"
        onChange={handleChange}
      >
        {insects.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Компонент для выбора заболеваний
const Diseases = ({ onChange }) => {
  const diseases = [
    { value: "powdery_mildew", label: "Мучнистая роса (Powdery Mildew)" },
    { value: "root_rot", label: "Корневая гниль (Root Rot)" },
    { value: "bud_rot", label: "Гниль соцветий (Bud Rot)" },
    { value: "leaf_septoria", label: "Септориоз листьев (Leaf Septoria)" },
    { value: "fusarium", label: "Фузариоз (Fusarium)" },
    { value: "pythium", label: "Питиум (Pythium)" },
    { value: "botrytis", label: "Ботритис (Botrytis)" }
  ];
  const [value, setValue] = useState("");
  
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    onChange((prev) => ({ 
      ...prev, 
      variant: "Disease", 
      item: selectedValue 
    }));
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 120, mt: 2 }} fullWidth>
      <InputLabel id="disease-label">Тип заболевания</InputLabel>
      <Select
        labelId="disease-label"
        value={value}
        label="Тип заболевания"
        onChange={handleChange}
      >
        {diseases.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Компонент для выбора проблем окружающей среды
const EnvironmentalIssues = ({ onChange }) => {
  const issues = [
    { value: "heat_stress", label: "Тепловой стресс" },
    { value: "cold_stress", label: "Холодовой стресс" },
    { value: "light_burn", label: "Ожог от света" },
    { value: "overwatering", label: "Переувлажнение" },
    { value: "underwatering", label: "Недостаток влаги" },
    { value: "low_humidity", label: "Низкая влажность" },
    { value: "high_humidity", label: "Высокая влажность" },
    { value: "poor_ventilation", label: "Плохая вентиляция" },
    { value: "wind_burn", label: "Ветровой ожог" }
  ];
  const [value, setValue] = useState("");
  
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    onChange((prev) => ({ 
      ...prev, 
      variant: "Environmental", 
      item: selectedValue 
    }));
  };

  return (
    <FormControl variant="outlined" sx={{ minWidth: 120, mt: 2 }} fullWidth>
      <InputLabel id="environmental-label">Проблема окружения</InputLabel>
      <Select
        labelId="environmental-label"
        value={value}
        label="Проблема окружения"
        onChange={handleChange}
      >
        {issues.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            {item.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Компонент для морфологических наблюдений
const MorphologyObservations = ({ onChange }) => {
  const observations = [
    // Особенности растения
    { value: "plant_structure", label: "Структура растения", category: "plant" },
    { value: "leaf_shape", label: "Форма листьев", category: "plant" },
    { value: "leaf_color", label: "Цвет листьев", category: "plant" },
    { value: "stem_thickness", label: "Толщина стебля", category: "plant" },
    { value: "node_spacing", label: "Междоузлия", category: "plant" },
    { value: "branching", label: "Ветвление", category: "plant" },
    { value: "growth_pattern", label: "Характер роста", category: "plant" },
    { value: "vigor", label: "Жизненная сила", category: "plant" },
    
    // Особенности соцветий
    { value: "bud_development", label: "Развитие соцветий", category: "flower" },
    { value: "bud_density", label: "Плотность соцветий", category: "flower" },
    { value: "bud_size", label: "Размер соцветий", category: "flower" },
    { value: "trichome_development", label: "Развитие трихом", category: "flower" },
    { value: "pistil_color", label: "Цвет пестиков", category: "flower" },
    { value: "calyx_structure", label: "Структура чашечек", category: "flower" },
    { value: "resin_production", label: "Выработка смолы", category: "flower" },
    { value: "aroma", label: "Аромат", category: "flower" }
  ];
  
  const [value, setValue] = useState("");
  const [category, setCategory] = useState("all");
  
  const handleChange = (e) => {
    const selectedValue = e.target.value;
    setValue(selectedValue);
    const selectedObservation = observations.find(obs => obs.value === selectedValue);
    onChange((prev) => ({ 
      ...prev, 
      variant: "Morphology", 
      item: selectedValue,
      label: selectedObservation?.label
    }));
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setValue("");
  };

  const filteredObservations = category === "all" 
    ? observations 
    : observations.filter(obs => obs.category === category);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl variant="outlined" fullWidth sx={{ mt: 2 }}>
        <InputLabel id="morphology-category-label">Категория наблюдения</InputLabel>
        <Select
          labelId="morphology-category-label"
          value={category}
          label="Категория наблюдения"
          onChange={handleCategoryChange}
        >
          <MenuItem value="all">Все</MenuItem>
          <MenuItem value="plant">Особенности растения</MenuItem>
          <MenuItem value="flower">Особенности соцветий</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="morphology-label">Морфологическое наблюдение</InputLabel>
        <Select
          labelId="morphology-label"
          value={value}
          label="Морфологическое наблюдение"
          onChange={handleChange}
        >
          {filteredObservations.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <TextField
        fullWidth
        multiline
        rows={3}
        variant="outlined"
        label="Детали наблюдения"
        placeholder="Опишите подробнее ваше наблюдение..."
        onChange={(e) => onChange((prev) => ({ 
          ...prev, 
          details: e.target.value 
        }))}
        sx={{ mt: 1 }}
      />
    </Box>
  );
};

// Компонент для произвольной заметки
const CustomNote = ({ onChange }) => {
  const [value, setValue] = useState("");
  
  const handleChange = (e) => {
    const inputValue = e.target.value;
    setValue(inputValue);
    onChange((prev) => ({ 
      ...prev, 
      variant: "Custom", 
      item: inputValue 
    }));
  };

  return (
    <TextField
      fullWidth
      multiline
      rows={4}
      variant="outlined"
      label="Ваша заметка"
      placeholder="Введите свою заметку здесь..."
      value={value}
      onChange={handleChange}
      sx={{ mt: 2 }}
    />
  );
};

export const NoteFields = () => {
  const dispatch = useDispatch();
  const [note, setNote] = useState({});

  // Конфигурация типов заметок
  const types = {
    Problem: {
      color: "error",
      text: "Проблема",
      items: {
        Deficiency: <Deficiencies onChange={setNote} />,
        Insects: <Insects onChange={setNote} />,
        Disease: <Diseases onChange={setNote} />,
        Environmental: <EnvironmentalIssues onChange={setNote} />
      }
    },
    Observation: {
      color: "info",
      text: "Наблюдение",
      items: {
        Morphology: <MorphologyObservations onChange={setNote} />,
        Custom: <CustomNote onChange={setNote} />
      }
    },
    Success: {
      color: "success",
      text: "Успех / Хорошая новость",
      items: {
        Custom: <CustomNote onChange={setNote} />
      }
    },
    Reminder: {
      color: "warning",
      text: "Напоминание",
      items: {
        Custom: <CustomNote onChange={setNote} />
      }
    },
    Note: {
      color: "default",
      text: "Заметка",
      items: {
        Custom: <CustomNote onChange={setNote} />
      }
    }
  };

  const handleType = (e) => {
    const { value } = e.target;
    // Сбрасываем variant и item при смене типа
    setNote({ type: value, variant: "", item: "" });
  };

  const handleVariant = (e) => {
    const { value } = e.target;
    // Сбрасываем item при смене варианта
    setNote((prev) => ({ ...prev, variant: value, item: "" }));
  };

  useEffect(() => {
    // Отправляем заметку в Redux только когда есть необходимые данные
    if (note.type && note.variant && note.item) {
      dispatch(addNote(note));
    }
  }, [note, dispatch]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 300 }}>
      <FormControl variant="outlined" fullWidth>
        <InputLabel id="noteType-label">Тип записи</InputLabel>
        <Select
          labelId="noteType-label"
          value={note?.type || ""}
          label="Тип записи"
          onChange={handleType}
        >
          {Object.keys(types).map((typeKey) => (
            <MenuItem key={typeKey} value={typeKey}>
              {types[typeKey].text}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {note?.type && (
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="variant-label">Категория</InputLabel>
          <Select
            labelId="variant-label"
            value={note?.variant || ""}
            label="Категория"
            onChange={handleVariant}
          >
            {Object.keys(types[note.type]?.items || {}).map((itemKey) => (
              <MenuItem key={itemKey} value={itemKey}>
                {itemKey === "Custom" ? "Своя заметка" : 
                 itemKey === "Deficiency" ? "Дефицит элементов" :
                 itemKey === "Insects" ? "Насекомые-вредители" :
                 itemKey === "Disease" ? "Заболевания" :
                 itemKey === "Environmental" ? "Проблемы окружения" :
                 itemKey === "Morphology" ? "Морфологические особенности" :
                 itemKey}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {note?.variant && note?.type && types[note.type]?.items[note.variant]}
    </Box>
  );
};

// PropTypes для валидации props
Deficiencies.propTypes = {
  onChange: PropTypes.func.isRequired
};

Insects.propTypes = {
  onChange: PropTypes.func.isRequired
};

Diseases.propTypes = {
  onChange: PropTypes.func.isRequired
};

EnvironmentalIssues.propTypes = {
  onChange: PropTypes.func.isRequired
};

CustomNote.propTypes = {
  onChange: PropTypes.func.isRequired
};

MorphologyObservations.propTypes = {
  onChange: PropTypes.func.isRequired
};
