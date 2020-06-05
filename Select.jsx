import React, { useState, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { useField } from 'formik'
import { createPropTypes } from 'libs'

import SelectMenu from './SelectMenu'

import { Label, Select, Placeholder, MultiSelectValueHolder, MultiSelectValue, Error } from './styles/Select'

/* Future improvements
  * API options
  * Using arrow keys and enter to select value
  * Using tab to open menu
  * Option to open menu above instead of under (maybe determine if it has room under)
  * Option to filter/show currently selected value (currently always filters it)

/* Bugs
  * Menu is not always on top of other elements

*/

function SelectComponent(props) {
  const selectInputRef = useRef(null)
  const [menuOpened, setMenuOpened] = useState(false)
  const [inputPosition, setInputPosition] = useState({ x: 0, y: 0, width: 0 }) // The select input client rect
  const [width, setWidth] = useState(window.innerWidth) // Width of the screen

  // Formik variables
  // let field, meta, helpers
  let field, meta, helpers
  if (props.formik) {
    const _useField = useField(props.name)
    field = _useField[0]
    meta = _useField[1]
    helpers = _useField[2]
  }

  // Create event listener for window size so we can keep the select menu the same
  //  width as the select input
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    const getSelectMenuPosition = () => {
      if (!selectInputRef || !selectInputRef.current) return
      const inputPos = selectInputRef.current.getBoundingClientRect()

      return {
        x: `${inputPos.x}px`,
        y: `${inputPos.y}px`,
        width: `${inputPos.width - 5}px`,
      }
    }

    setInputPosition(getSelectMenuPosition())
  }, [selectInputRef, width])

  const getValue = () => {
    if (!props.value && !field.value) return

    // Multi return values in pill form
    if (props.isMulti) {
      let valueArray = props.value
      let onChange = props.onChange

      if (props.formik) {
        valueArray = field.value
        onChange = helpers.setValue
      }

      return (
        <MultiSelectValueHolder>
          {props.options
            .filter(option => valueArray.includes(option.value))
            .map((option, i) => (
              <MultiSelectValue key={i}>
                {option.label}
                <i
                  className="fas fa-times"
                  onClick={() => onChange(valueArray.filter(value => value !== option.value))}
                />
              </MultiSelectValue>
            ))}
        </MultiSelectValueHolder>
      )
    } else {
      let foundOption = null
      if (props.formik) {
        foundOption = props.options.find(option => option.value === field.value)
      } else {
        foundOption = props.options.find(option => option.value === props.value)
      }

      if (foundOption) {
        return foundOption.label
      } else {
        return 'Invalid value'
      }
    }
  }

  return (
    <div style={props.style}>
      <Label error={(meta && meta.error) || props.error}>{props.label}</Label>
      <Select
        ref={selectInputRef}
        menuOpened={menuOpened}
        isMulti={props.isMulti}
        onClick={() => !props.disabled && setMenuOpened(!menuOpened)}
        error={(meta && meta.error) || props.error}
        disabled={props.disabled}
        name={props.name}
      >
        {(!props.value || props.value.length === 0) && (!field || !field.value || field.value.length === 0) ? (
          <Placeholder>{props.placeholder}</Placeholder>
        ) : (
          getValue()
        )}
        <i className="fas fa-sort" />
      </Select>
      {((meta && meta.error) || props.error) && !menuOpened && (
        <Error>{meta && meta.error ? meta.error : props.error}</Error>
      )}
      <SelectMenu
        options={props.options}
        onChange={props.formik ? helpers.setValue : props.onChange}
        inputPosition={inputPosition}
        visible={menuOpened}
        closeMenu={() => setMenuOpened(false)}
        isMulti={props.isMulti}
        value={props.formik ? field.value : props.value}
        hideSearch={props.hideSearch}
        closeOnSelect={props.closeOnSelect}
        customMenuOptions={props.customMenuOptions}
        customFilter={props.customFilter}
        emptyOption={props.emptyOption}
        selectInputRef={selectInputRef}
      />
    </div>
  )
}

SelectComponent.defaultProps = {
  hideSearch: false,
  disabled: false,
  closeOnSelect: true,
  isMulti: false,
  customMenuOptions: null,
  customFilter: null,
  emptyOption: false,
}

SelectComponent.PropTypesDocs = {
  label: { type: PropTypes.string, description: 'Label of select input.' },
  value: {
    type: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    customType: 'string || number || array',
    description: 'Value of the currently selected option.',
  },
  formik: { type: PropTypes.bool, description: 'If using formik or not.' },
  name: { type: PropTypes.string, description: 'Name of select - for formik.' },
  style: { type: PropTypes.object, description: 'Custom styles that will be applied to parent DIV.' },
  error: { type: PropTypes.string, description: 'Error message to display to user.' },
  onChange: {
    type: PropTypes.func,
    description: 'Callback when value is changed for select. Will return string or array of strings.',
  },
  options: {
    type: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        label: PropTypes.string,
        disabled: PropTypes.bool,
        icon: PropTypes.string,
        action: PropTypes.func,
        hr: PropTypes.bool,
      }),
    ),
    customType: 'array of objects {value, label, disabled, icon, action, hr}',
    description: `Options to be shown in menu. 'action' implies a
       callback when clicked. 'hr' is a bool that will draw a horizontal ruler.`,
  },
  hideSearch: { type: PropTypes.bool, description: 'Hide search box, default false.' },
  closeOnSelect: { type: PropTypes.bool, description: 'Close when user selects a value, default true.' },
  disabled: { type: PropTypes.bool, description: 'Select disabled.' },
  isMulti: { type: PropTypes.bool, description: 'Multiple values can be choosen by user returning array of strings.' },
  emptyOption: { type: PropTypes.bool, description: 'Allow the user to choose a option with no value, default false.' },
  customMenuOptions: { type: PropTypes.func, description: 'Display custom menu options via a custom hook.' },
  customFilter: {
    type: PropTypes.func,
    description: 'Create custom filter with a callback function, filterValue and curent menu object will be given.',
  },
}

SelectComponent.propTypes = createPropTypes(SelectComponent.PropTypesDocs)

export default SelectComponent
