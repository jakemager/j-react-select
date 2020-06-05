import styled from 'styled-components'

export const Label = styled.label`
  margin-bottom: 0;
  color: ${props => (props.error ? '#ff8482' : '#000')};
`

export const Select = styled.div`
  min-height: 38px;
  height: 38px;
  border: 1px solid #eee;
  border-color: ${props => (props.menuOpened ? '#ddd' : props.error ? '#ff8482' : '#ced4da')};
  padding: 0 10px;
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;

  i {
    color: ${props => (props.menuOpened ? '#ddd' : props.disabled ? '#ddd' : '#747a80')};
    font-size: 16px;
  }

  &:hover {
    border-color: ${props => !props.disabled && '#ddd'};
    cursor: ${props => (!props.disabled ? 'pointer' : 'not-allowed')};

    i {
      color: ${props => !props.disabled && '#ddd'};
    }
  }
`

export const Placeholder = styled.span`
  color: #ddd;
`

export const SelectMenu = styled.div`
  position: fixed;
  min-width: ${props => (props.inputPosition ? props.inputPosition.width : 0)};
  width: ${props => (props.inputPosition ? props.inputPosition.width : 0)};
  max-height: 250px;
  overflow-y: scroll;
  background: #fff;
  z-index: 999;
  display: ${props => (props.visible ? 'flex' : 'none')};
  flex-direction: column;
  padding-top: 10px;
  padding-bottom: 10px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.11);
`
export const SelectMenuOption = styled.span`
  padding: 10px;
  color: ${props => (props.disabled ? '#989fa6' : '#747a80')};

  &:hover {
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
    background: ${props => (props.disabled ? '' : '#f9f9f9')};
    color: ${props => (props.disabled ? '' : '#16181b')};
  }
`
export const SelectMenuNoResults = styled.span`
  padding: 10px;
  color: #747a80;
`

export const SelectMenuSearch = styled.div`
  display: flex;
  flex-direction: row;
`

export const SelectMenuSearchInput = styled.input`
  border: 0;
  background-color: transparent;
  height: 45px;
  color: #495057;
  width: 100%;
  padding-left: 38px;
  border-bottom: 1px solid #ddd;

  &:focus {
    outline: none;
  }
`

export const SearchIcon = styled.i`
  color: #747a80;
  position: absolute;
  left: 8px;
  top: 22px;
  font-size: 16px;
`

export const MultiSelectValueHolder = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`

export const MultiSelectValue = styled.span`
  background: #7280ce;
  border-radius: 3px;
  padding: 3px 5px;
  margin-right: 3px;
  margin-top: 2px;
  margin-bottom: 2px;
  color: #fff;
  user-select: none;

  i {
    color: #fff !important;
    padding-left: 3px;
    font-size: 12px;
    cursor: pointer;
  }
`

export const Error = styled.div`
  margin-top: 3px;
  font-size: 12px;
  color: #ff8482;
`
