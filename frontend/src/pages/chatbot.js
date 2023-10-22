import { MessageBox, ChatItem} from "react-chat-elements";
import { Row, Col } from 'antd';
import Layouts from '../components/Layouts';
import Chatbox from '../components/chatbox';




function ChatbotPage() {

  // const [fileList, setFileList] = useState([]);
  // const [previewOpen, setPreviewOpen] = useState(false);
  // const [previewImage, setPreviewImage] = useState('');
  // const [loading, setLoading] = useState(false);
  // const [showResult, setShowResult] = useState(false);
  // const [responseText, setResponseText] = useState('');
  // const [isTypingComplete, setIsTypingComplete] = useState(false);

  return (
    <Layouts>   
      <h1>testing</h1> 
      <Row>  
        <Chatbox />
      </Row>
    </Layouts>
  );
}

export default ChatbotPage;
