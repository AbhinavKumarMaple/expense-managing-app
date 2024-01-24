import React, {useEffect, useState} from 'react';
import DatePicker from 'react-native-date-picker';

const DatePickerComp = ({date, isOpen, onDateChange, onClose, mode}) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);
  //sate for mode
  const [datePickerMode, setDatePickerMode] = useState('date');

  const handleDateConfirm = newDate => {
    setSelectedDate(newDate);
    onDateChange(newDate);
    setOpen(false);
  };

  //useEffect for selecting mode
  useEffect(() => {
    if (mode == 0) {
      setDatePickerMode('time');
    } else if (mode == 1) {
      setDatePickerMode('datetime');
    } else if (mode >= 2) {
      setDatePickerMode('date');
    }
    setOpen(false);
  }, [mode]);

  return (
    <>
      <DatePicker
        modal
        mode={datePickerMode} // Set the mode based on the prop
        open={isOpen}
        date={selectedDate || new Date()} // Use selectedDate or current date
        onConfirm={handleDateConfirm}
        maximumDate={new Date()}
        onCancel={() => {
          setOpen(false);
          onClose();
        }}
      />
    </>
  );
};

export default DatePickerComp;
