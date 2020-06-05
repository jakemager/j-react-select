import React, { useState, useEffect, useRef } from 'react'
import {
  SelectMenu,
  SelectMenuOption,
  SelectMenuNoResults,
  SelectMenuSearch,
  SelectMenuSearchInput,
  SearchIcon,
} from './styles/Select'

function SelectMenuComponent({
  options,
  onChange,
  inputPosition,
  visible,
  closeMenu,
  isMulti,
  value,
  hideSearch,
  closeOnSelect,
  emptyOption,
  customMenuOptions,
  customFilter,
  selectInputRef,
}) {
  const selectMenuRef = useRef(null)
  const selectMenuSearchRef = useRef(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        selectMenuRef.current &&
        !selectMenuRef.current.contains(event.target) &&
        selectInputRef.current &&
        !selectInputRef.current.contains(event.target)
      ) {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (visible && selectMenuSearchRef && selectMenuSearchRef.current) {
      selectMenuSearchRef.current.focus()
    } else if (!visible) {
      setFilter('')
    }
  }, [visible])

  useEffect(() => {
    if (customMenuOptions && closeOnSelect) {
      closeMenu()
    }
  }, [value])

  const filterOptions = () => {
    return options.filter(option => {
      if (filter.length === 0 && (option.hr || option.action)) {
        return true
      }

      let hasValue = true
      if (!option.value) hasValue = false

      let notSelected = true
      if (isMulti) {
        notSelected = !value.includes(option.value)
      } else if (value === option.value) {
        notSelected = false
      }

      let inFilter = true
      if (customFilter) {
        inFilter = customFilter(filter, option)
      } else {
        inFilter = option.label.toLowerCase().includes(filter)
      }

      return notSelected && inFilter && hasValue
    })
  }

  const createOptions = () => {
    if (!options) return null
    let filteredOptions = filterOptions()

    if (filteredOptions.length === 0 && !emptyOption) {
      return <SelectMenuNoResults>No results found</SelectMenuNoResults>
    } else {
      let _options = filteredOptions.map((option, i) => {
        let { label, disabled, action, hr, icon } = option

        // Check if horizontal ruler
        if (hr) {
          return (
            <span key={i}>
              <hr />
            </span>
          )
        } else if (action) {
          // Else check if it is an action
          return (
            <SelectMenuOption
              key={i}
              onClick={() => {
                if (disabled) return
                action()
                closeOnSelect && closeMenu()
              }}
              disabled={disabled}
            >
              <i style={{ marginRight: 5 }} className={`fa ${icon}`} />
              {label}
            </SelectMenuOption>
          )
        }

        return (
          <SelectMenuOption
            key={i}
            onClick={() => {
              if (disabled) return
              if (isMulti) {
                onChange([...value, option.value])
              } else {
                onChange(option.value)
              }
              closeOnSelect && closeMenu()
            }}
            disabled={disabled}
          >
            <i style={{ marginRight: 5 }} className={`fa ${icon}`} />
            {label}
          </SelectMenuOption>
        )
      })

      if (emptyOption) {
        return [
          <SelectMenuOption
            key="-1"
            onClick={() => {
              onChange('')
              closeOnSelect && closeMenu()
            }}
          >
            -
          </SelectMenuOption>,
          ..._options,
        ]
      } else {
        return _options
      }
    }
  }

  return (
    <SelectMenu ref={selectMenuRef} inputPosition={inputPosition} visible={visible}>
      <SelectMenuSearch style={{ minHeight: hideSearch ? 0 : 45 }}>
        {!hideSearch && (
          <>
            <SearchIcon className="fa fa-search" />
            <SelectMenuSearchInput
              ref={selectMenuSearchRef}
              value={filter}
              onChange={e => {
                setFilter(e.target.value)
              }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (customMenuOptions) return

                  let filteredOptions = filterOptions()
                  if (filteredOptions[0] && !filteredOptions[0].disabled) {
                    if (isMulti) {
                      onChange([...value, filteredOptions[0].value])
                    } else {
                      onChange(filteredOptions[0].value)
                    }
                    closeOnSelect && closeMenu()
                  }
                }
              }}
            />
          </>
        )}
      </SelectMenuSearch>
      {customMenuOptions ? customMenuOptions(filter) : createOptions()}
    </SelectMenu>
  )
}

export default SelectMenuComponent
