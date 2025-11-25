import styled from 'styled-components';

export const ActionButton = styled.button`
  flex: 1;
  padding: 12px 16px;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: background-color 0.2s ease;
`;

export const PrimaryButton = styled(ActionButton)`
  background-color: #007bff;
  &:hover {
    background-color: #0056b3;
  }
`;

export const DangerButton = styled(ActionButton)`
  background-color: #ff4444;
  &:hover {
    background-color: #ff0000;
  }
`;

export const SwitchContainer = styled.div`
  position: relative;
  width: 50px;
  height: 24px;
`;

export const SwitchInput = styled.input`
  opacity: 0;
  width: 0;
  height: 0;
  position: absolute;
`;

export const SwitchLabel = styled.label`
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
  padding: 2px;

  ${SwitchInput}:checked + & {
    background-color: #0066cc;
  }
`;

export const SwitchHandle = styled.span`
  position: absolute;
  content: "";
  height: 20px;
  width: 20px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  transform: translateX(0);

  ${SwitchInput}:checked + ${SwitchLabel} & {
    transform: translateX(26px);
  }
`;

export const SectionContainer = styled.div`
  margin-bottom: 8px;
  margin-top: 8px;
`;

export const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

export const SectionLabel = styled.span`
  font-weight: 500;
  width: 100px;
  flex-shrink: 0;
`;

export const ColorChangerLabel = styled.span`
  font-weight: 600;
  flex-shrink: 0;
`;

export const ColorSwatches = styled.div`
  display: flex;
  gap: 8px;
`;

export const ColorSwatch = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  flex-shrink: 0;
  background-color: ${props => props.color};
`; 

export const TabBarButton = styled.button`
  width: 100%;
  height: 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* use transient prop $active to avoid forwarding boolean to DOM */
  background-color: ${props => props.$active ? "#e6f3ff" : "transparent"};
  border: none;
  cursor: pointer;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 8px;
  color: ${props => props.$active ? "#0066cc" : "#666"};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.$active ? "#e6f3ff" : "#f5f5f5"};
  }

  .icon {
    font-size: 24px;
    color: ${props => props.$active ? "#0066cc" : "#666"};
    margin-bottom: 4px;
  }

  .label {
    font-size: 12px;
    color: ${props => props.$active ? "#0066cc" : "#666"};
  }
`;

export const TabContent = styled.div`
  flex: 1;
  overflow-y: auto;
  background-color: #ffffff;
  height: 100%;
`;

export const PageContent = styled.div`
  padding: 16px;
  background-color: #ffffff;
`;

